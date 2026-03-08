import { useEffect, useState } from "react";
import type { ICollection, IHistoryItem } from "./Types";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { AddressBar } from "./components/workspace/AddressBar";
import { RequestPane } from "./components/workspace/RequestPane";
import { ResponsePane } from "./components/workspace/ResponsePane";

// --- MOCK DATA ---
const initialCollections: ICollection[] = [
  {
    id: "1",
    name: "E-commerce API",
    isOpen: true,
    items: [
      { id: "1-1", type: "request", method: "GET", name: "Get Products" },
      { id: "1-2", type: "request", method: "POST", name: "Create Order" },
      {
        id: "1-3",
        type: "request",
        method: "PUT",
        name: "Update User Profile",
      },
      { id: "1-4", type: "request", method: "DELETE", name: "Remove Item" },
    ],
  },
  {
    id: "2",
    name: "Payment Gateway",
    isOpen: false,
    items: [
      { id: "2-1", type: "request", method: "POST", name: "Init Transaction" },
      { id: "2-2", type: "request", method: "GET", name: "Check Status" },
    ],
  },
];

const mockHistory: IHistoryItem[] = [
  {
    id: "h1",
    method: "GET",
    name: "Get Products",
    time: "2 mins ago",
    status: 200,
  },
  {
    id: "h2",
    method: "POST",
    name: "Create Order",
    time: "1 hour ago",
    status: 201,
  },
  {
    id: "h3",
    method: "PUT",
    name: "Update User Profile",
    time: "Yesterday",
    status: 400,
  },
];

export default function App() {
  // Theme State
  const [themeMode, setThemeMode] = useState("system");
  const [isDark, setIsDark] = useState(true);

  // Layout State
  const [activeSidebarTab, setActiveSidebarTab] = useState("collections"); // collections, history, env
  const [collections, setCollections] = useState(initialCollections);
  const [sidebarWidth] = useState(260); // Intentionally unused setSidebarWidth for MVP

  // Request State
  const [activeReqTab, setActiveReqTab] = useState("Params");
  const [authType, setAuthType] = useState("Bearer");
  const [bodyType, setBodyType] = useState("JSON");

  // Response State
  const [responseTab, setResponseTab] = useState("Body");
  const [isSending, setIsSending] = useState(false);
  const [showResponse, setShowResponse] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  const toggleCollection = (id: string) => {
    setCollections(
      collections.map((c) => (c.id === id ? { ...c, isOpen: !c.isOpen } : c)),
    );
  };

  const handleSend = () => {
    setIsSending(true);
    setShowResponse(false);
    setTimeout(() => {
      setIsSending(false);
      setShowResponse(true);
    }, 800);
  };

  const copyToClipboard = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${isDark ? "dark" : ""} h-screen w-screen overflow-hidden font-sans text-[13px] antialiased bg-white dark:bg-[#0d0f14] text-gray-800 dark:text-gray-300 transition-colors selection:bg-[#4f8ef7]/30`}
    >
      <div className="flex h-full flex-col">
        {/* --- HEADER --- */}
        <Header themeMode={themeMode} setThemeMode={setThemeMode} />

        {/* --- MAIN WORKSPACE --- */}
        <div className="flex flex-1 overflow-hidden">
          {/* --- SIDEBAR COMPONENTS --- */}
          <Sidebar
            activeSidebarTab={activeSidebarTab}
            setActiveSidebarTab={setActiveSidebarTab}
            collections={collections}
            toggleCollection={toggleCollection}
            mockHistory={mockHistory}
            sidebarWidth={sidebarWidth}
          />

          {/* --- RIGHT PANEL (Editors) --- */}
          <main className="flex flex-1 flex-col bg-white dark:bg-[#12151c] min-w-0">
            {/* --- ADDRESS BAR --- */}
            <AddressBar handleSend={handleSend} isSending={isSending} />

            {/* --- SPLIT PANE: REQUEST & RESPONSE --- */}
            <div className="flex flex-1 overflow-hidden border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d0f14]">
              {/* --- REQUEST PANE (Left) --- */}
              <RequestPane
                activeReqTab={activeReqTab}
                setActiveReqTab={setActiveReqTab}
                bodyType={bodyType}
                setBodyType={setBodyType}
                authType={authType}
                setAuthType={setAuthType}
              />

              {/* --- RESPONSE PANE (Right) --- */}
              <ResponsePane
                showResponse={showResponse}
                responseTab={responseTab}
                setResponseTab={setResponseTab}
                copied={copied}
                copyToClipboard={copyToClipboard}
              />
            </div>
          </main>
        </div>

        {/* --- BOTTOM STATUS BAR --- */}
        <Footer />
      </div>
    </div>
  );
}
