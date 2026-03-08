import { useEffect, useState } from 'react';
import type { IHistoryItem } from './Types';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AddressBar } from './components/workspace/AddressBar';
import { RequestPane } from './components/workspace/RequestPane';
import { ResponsePane } from './components/workspace/ResponsePane';
import { seedDatabase } from './db/seed';

const mockHistory: IHistoryItem[] = [
  {
    id: 'h1',
    method: 'GET',
    name: 'Get Products',
    time: '2 mins ago',
    status: 200,
  },
  {
    id: 'h2',
    method: 'POST',
    name: 'Create Order',
    time: '1 hour ago',
    status: 201,
  },
];

export default function App() {
  // Database seed
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  // Theme State
  const [themeMode, setThemeMode] = useState('system');
  const [isDark, setIsDark] = useState(true);

  // Layout State
  const [activeSidebarTab, setActiveSidebarTab] = useState('collections');
  const [sidebarWidth] = useState(260);

  // Request State
  const [activeReqTab, setActiveReqTab] = useState('Params');

  // Response State
  const [responseTab, setResponseTab] = useState('Body');
  const [isSending, setIsSending] = useState(false);
  const [showResponse, setShowResponse] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      if (themeMode === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(themeMode === 'dark');
      }
    };
    handleThemeChange();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (themeMode === 'system')
      mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [themeMode]);

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
      className={`${isDark ? 'dark' : ''} h-screen w-screen overflow-hidden font-sans text-[13px] antialiased text-gray-800 dark:text-gray-300 transition-colors selection:bg-[#4f8ef7]/30`}
    >
      {/* Dynamic Background */}
      <div className="u-bg-vibrant pointer-events-none" />

      <div className="flex h-full flex-col relative z-0">
        <Header themeMode={themeMode} setThemeMode={setThemeMode} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeSidebarTab={activeSidebarTab}
            setActiveSidebarTab={setActiveSidebarTab}
            mockHistory={mockHistory}
            sidebarWidth={sidebarWidth}
          />

          <main className="flex flex-1 flex-col min-w-0 u-glass-deep !border-none !rounded-none">
            <AddressBar handleSend={handleSend} isSending={isSending} />

            <div className="flex flex-1 overflow-hidden border-t border-gray-200/50 dark:border-gray-800/50">
              <RequestPane
                activeReqTab={activeReqTab}
                setActiveReqTab={setActiveReqTab}
              />

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

        <Footer />
      </div>
    </div>
  );
}
