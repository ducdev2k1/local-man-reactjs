import { useEffect, useState } from "react";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import type { IApiResponse } from "./Types/models";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { AddressBar } from "./components/workspace/AddressBar";
import { RequestPane } from "./components/workspace/RequestPane";
import { ResponsePane } from "./components/workspace/ResponsePane";
import { seedDatabase } from "./db/seed";
import { environmentService } from "./db/services/environment-service";
import { historyService } from "./db/services/history-service";
import { sendRequest } from "./lib/http-client";
import { useRequestStore } from "./stores/request-store";

export default function App() {
  // Database seed
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  // Theme State
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("themeMode") || "system");
  const [isDark, setIsDark] = useState(true);

  // Layout State
  const [activeSidebarTab, setActiveSidebarTab] = useState("collections");
  const [sidebarWidth] = useState(260);
  const [layoutDirection, setLayoutDirection] = useState<"horizontal" | "vertical">("horizontal");

  // Request State
  const { activeRequest, restoreSession } = useRequestStore();
  const [activeReqTab, setActiveReqTab] = useState("Params");

  // Restore session from cache
  useEffect(() => {
    restoreSession().catch(console.error);
  }, [restoreSession]);

  // Response State
  const [activeResponse, setActiveResponse] = useState<IApiResponse | null>(null);
  const [responseTab, setResponseTab] = useState("Body");
  const [isSending, setIsSending] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
    
    const handleThemeChange = () => {
      if (themeMode === "system") {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      } else {
        setIsDark(themeMode === "dark");
      }
    };
    handleThemeChange();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (themeMode === "system")
      mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, [themeMode]);

  const handleSend = async () => {
    if (!activeRequest) return;

    setIsSending(true);
    setShowResponse(false);
    setActiveResponse(null);

    try {
      const envs = await environmentService.getAll();
      const activeEnv = envs.find((e) => e.is_active);

      const resp = await sendRequest(activeRequest, activeEnv);
      setActiveResponse(resp);
      setShowResponse(true);

      // Save to history
      await historyService.add({
        request_id: activeRequest.id,
        method: activeRequest.method,
        url: activeRequest.url,
        status_code: resp.status,
        response_time: resp.time,
        response_size: resp.size,
        request_snapshot: { ...activeRequest },
        response_body: resp.body,
        response_headers: resp.headers,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${isDark ? "dark" : ""} h-screen w-screen overflow-hidden font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0B0E14] transition-colors duration-300 selection:bg-[#4f8ef7]/30 flex flex-col`}
    >
      <Header themeMode={themeMode} setThemeMode={setThemeMode} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSidebarTab={activeSidebarTab}
          setActiveSidebarTab={setActiveSidebarTab}
          sidebarWidth={sidebarWidth}
        />

        <main className="flex flex-1 flex-col min-w-0 bg-white dark:bg-[#0B0E14]">
          <AddressBar handleSend={handleSend} isSending={isSending} layoutDirection={layoutDirection} setLayoutDirection={setLayoutDirection} />

          <div className="flex flex-1 overflow-hidden border-t border-gray-200/50 dark:border-gray-800/50">
            <PanelGroup orientation={layoutDirection}>
              <Panel defaultSize={50} minSize={20} className="flex">
                <RequestPane
                  activeReqTab={activeReqTab}
                  setActiveReqTab={setActiveReqTab}
                />
              </Panel>
              
              <PanelResizeHandle className={`transition-colors bg-gray-200/50 dark:bg-gray-800/50 hover:bg-[#4f8ef7] ${layoutDirection === "horizontal" ? "w-[1px] cursor-col-resize" : "h-1 cursor-row-resize"}`} />

              <Panel defaultSize={50} minSize={20} className="flex">
                <ResponsePane
                  showResponse={showResponse}
                  response={activeResponse}
                  responseTab={responseTab}
                  setResponseTab={setResponseTab}
                  copied={copied}
                  copyToClipboard={copyToClipboard}
                />
              </Panel>
            </PanelGroup>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
