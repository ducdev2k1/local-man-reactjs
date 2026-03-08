import React, { useState, useEffect } from 'react';
import { 
  Folder, FileJson, Play, Settings, Moon, Sun, Monitor, 
  Plus, Trash2, Search, Zap, Cloud, Database, ChevronRight, 
  ChevronDown, MoreVertical, Copy, Check, Clock, Globe, 
  Layout, Code2, Shield, Braces, Lock, Menu, X, ArrowRightLeft,
  TerminalSquare
} from 'lucide-react';

// --- MOCK DATA ---
const initialCollections = [
  {
    id: '1',
    name: 'E-commerce API',
    isOpen: true,
    items: [
      { id: '1-1', type: 'request', method: 'GET', name: 'Get Products' },
      { id: '1-2', type: 'request', method: 'POST', name: 'Create Order' },
      { id: '1-3', type: 'request', method: 'PUT', name: 'Update User Profile' },
      { id: '1-4', type: 'request', method: 'DELETE', name: 'Remove Item' },
    ]
  },
  {
    id: '2',
    name: 'Payment Gateway',
    isOpen: false,
    items: [
      { id: '2-1', type: 'request', method: 'POST', name: 'Init Transaction' },
      { id: '2-2', type: 'request', method: 'GET', name: 'Check Status' },
    ]
  }
];

const mockHistory = [
  { id: 'h1', method: 'GET', name: 'Get Products', time: '2 mins ago', status: 200 },
  { id: 'h2', method: 'POST', name: 'Create Order', time: '1 hour ago', status: 201 },
  { id: 'h3', method: 'PUT', name: 'Update User Profile', time: 'Yesterday', status: 400 },
];

// --- HELPER COMPONENTS ---
const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20',
    POST: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20',
    PUT: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20',
    DELETE: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20',
    PATCH: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20',
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${colors[method] || 'text-gray-500'}`}>
      {method}
    </span>
  );
};

const MethodText = ({ method }) => {
  const colors = {
    GET: 'text-green-600 dark:text-green-400',
    POST: 'text-orange-600 dark:text-orange-400',
    PUT: 'text-yellow-600 dark:text-yellow-400',
    DELETE: 'text-red-600 dark:text-red-400',
    PATCH: 'text-purple-600 dark:text-purple-400',
  };
  return <span className={`font-bold ${colors[method] || 'text-gray-500'}`}>{method}</span>;
};

// Reusable Key-Value Row for Params/Headers
const KeyValueRow = ({ isNew, defaultKey = '', defaultVal = '', defaultDesc = '' }) => (
  <div className="flex group items-center border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-[#181c25]/50 transition-colors">
    <div className="w-8 flex justify-center py-2">
      {!isNew && <input type="checkbox" defaultChecked className="accent-[#4f8ef7] rounded-sm w-3 h-3 border-gray-300 dark:border-gray-600 bg-transparent" />}
    </div>
    <div className="w-1/3 border-r border-gray-100 dark:border-gray-800/60">
      <input type="text" placeholder={isNew ? "New key" : "Key"} defaultValue={defaultKey} className={`w-full bg-transparent px-3 py-1.5 outline-none font-mono text-xs focus:bg-white dark:focus:bg-[#12151c] ${isNew ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`} />
    </div>
    <div className="w-1/3 border-r border-gray-100 dark:border-gray-800/60">
      <input type="text" placeholder={isNew ? "Value" : "Value"} defaultValue={defaultVal} className={`w-full bg-transparent px-3 py-1.5 outline-none font-mono text-xs focus:bg-white dark:focus:bg-[#12151c] ${isNew ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`} />
    </div>
    <div className="flex-1 flex items-center justify-between">
      <input type="text" placeholder={isNew ? "Description" : "Description"} defaultValue={defaultDesc} className="w-full bg-transparent px-3 py-1.5 outline-none text-xs text-gray-500 focus:bg-white dark:focus:bg-[#12151c]" />
      {!isNew && <button className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-all"><Trash2 size={12} /></button>}
    </div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  // Theme State
  const [themeMode, setThemeMode] = useState('system');
  const [isDark, setIsDark] = useState(true);

  // Layout State
  const [activeSidebarTab, setActiveSidebarTab] = useState('collections'); // collections, history, env
  const [collections, setCollections] = useState(initialCollections);
  const [sidebarWidth, setSidebarWidth] = useState(260);

  // Request State
  const [activeReqTab, setActiveReqTab] = useState('Params');
  const [authType, setAuthType] = useState('Bearer');
  const [bodyType, setBodyType] = useState('JSON');
  
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
    if (themeMode === 'system') mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [themeMode]);

  const toggleCollection = (id) => {
    setCollections(collections.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
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
    <div className={`${isDark ? 'dark' : ''} h-screen w-screen overflow-hidden font-sans text-[13px] antialiased bg-white dark:bg-[#0d0f14] text-gray-800 dark:text-gray-300 transition-colors selection:bg-[#4f8ef7]/30`}>
      <div className="flex h-full flex-col">
        
        {/* --- HEADER --- */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-[#0d0f14] z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4f8ef7] to-[#82b4ff] shadow-sm shadow-blue-500/20">
              <Zap size={14} className="text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white tracking-tight">Localman</span>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-0.5 rounded-lg bg-gray-100/80 dark:bg-[#181c25] border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <button className="rounded-md bg-white px-4 py-1.5 text-xs font-semibold shadow-sm dark:bg-[#232834] dark:text-white transition-all">Requests</button>
            <button className="rounded-md px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-all">Runner</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-green-200/50 bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-600 dark:border-green-900/30 dark:bg-green-500/10 dark:text-green-400">
              <Cloud size={12} />
              <span>Synced</span>
            </div>

            <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800"></div>

            <div className="flex items-center gap-1">
              <div className="relative group">
                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-[#181c25] text-gray-500 dark:text-gray-400 transition-colors">
                  {themeMode === 'light' ? <Sun size={15} /> : themeMode === 'dark' ? <Moon size={15} /> : <Monitor size={15} />}
                </button>
                <div className="absolute right-0 top-full z-20 hidden mt-1 w-36 rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur p-1.5 shadow-xl group-hover:block dark:border-gray-800 dark:bg-[#181c25]/95">
                  <button onClick={() => setThemeMode('light')} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${themeMode === 'light' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}><Sun size={14}/> Sáng</button>
                  <button onClick={() => setThemeMode('dark')} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${themeMode === 'dark' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}><Moon size={14}/> Tối</button>
                  <button onClick={() => setThemeMode('system')} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${themeMode === 'system' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}><Monitor size={14}/> Hệ thống</button>
                </div>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 dark:text-gray-400 dark:hover:bg-[#181c25] transition-colors"><Settings size={15} /></button>
            </div>
          </div>
        </header>

        {/* --- MAIN WORKSPACE --- */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* --- ACTIVITY BAR (Leftmost) --- */}
          <nav className="flex w-12 flex-col items-center border-r border-gray-200 bg-gray-50 py-3 dark:border-gray-800 dark:bg-[#0d0f14]">
            <div className="flex flex-col gap-2 w-full px-2">
              {[
                { id: 'collections', icon: Folder, tooltip: 'Collections' },
                { id: 'environments', icon: Globe, tooltip: 'Environments' },
                { id: 'history', icon: Clock, tooltip: 'History' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSidebarTab(item.id)}
                  className={`relative flex h-8 w-full items-center justify-center rounded-lg transition-all duration-200 group ${
                    activeSidebarTab === item.id 
                      ? 'bg-blue-50 text-[#4f8ef7] dark:bg-blue-500/10 dark:text-[#4f8ef7]' 
                      : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-gray-200'
                  }`}
                >
                  <item.icon size={18} strokeWidth={activeSidebarTab === item.id ? 2.5 : 2} />
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-sm group-hover:block dark:bg-white dark:text-gray-900 z-50 whitespace-nowrap">
                    {item.tooltip}
                  </div>
                </button>
              ))}
            </div>
          </nav>

          {/* --- SIDEBAR PANEL --- */}
          <aside style={{ width: sidebarWidth }} className="flex flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-[#12151c]">
            {activeSidebarTab === 'collections' && (
              <>
                <div className="flex items-center justify-between p-3">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">Collections</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-white transition-colors"><Plus size={14} /></button>
                    <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-white transition-colors"><Search size={14} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4">
                  {collections.map(col => (
                    <div key={col.id} className="mb-0.5 select-none">
                      <div 
                        onClick={() => toggleCollection(col.id)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 px-2 hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-800 dark:text-gray-200 transition-colors"
                      >
                        {col.isOpen ? <ChevronDown size={14} className="text-gray-400 dark:text-gray-500" /> : <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />}
                        <Folder size={14} className="text-[#4f8ef7] fill-[#4f8ef7]/20 dark:fill-[#4f8ef7]/30" />
                        <span className="truncate text-xs font-medium">{col.name}</span>
                      </div>
                      
                      {col.isOpen && (
                        <div className="ml-5 mt-0.5 mb-1.5 space-y-0.5 border-l border-gray-200 dark:border-gray-800">
                          {col.items.map(item => (
                            <div key={item.id} className={`group flex cursor-pointer items-center justify-between rounded-md py-1.5 pl-3 pr-2 transition-colors ${item.id === '1-1' ? 'bg-[#4f8ef7]/10 text-[#4f8ef7] dark:bg-[#4f8ef7]/20' : 'hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-700 dark:text-gray-300'}`}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <MethodBadge method={item.method} />
                                <span className={`truncate text-[12px] ${item.id === '1-1' ? 'font-medium text-[#4f8ef7] dark:text-[#6fa8ff]' : 'dark:group-hover:text-gray-100'}`}>{item.name}</span>
                              </div>
                              <MoreVertical size={14} className="opacity-0 text-gray-400 dark:text-gray-500 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSidebarTab === 'history' && (
              <>
                <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">History</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {mockHistory.map(h => (
                    <div key={h.id} className="p-3 border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-[#1e2330] cursor-pointer group transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <MethodText method={h.method} />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate max-w-[120px] transition-colors">{h.name}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${h.status === 200 || h.status === 201 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>{h.status}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500">
                        <span>{h.time}</span>
                        <ArrowRightLeft size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>

          {/* --- RIGHT PANEL (Editors) --- */}
          <main className="flex flex-1 flex-col bg-white dark:bg-[#12151c] min-w-0">
            
            {/* --- TABS BAR --- */}
            <div className="flex h-10 shrink-0 items-end border-b border-gray-200 dark:border-gray-800 px-2 pt-2 bg-gray-50 dark:bg-[#0d0f14] overflow-x-auto hide-scrollbar">
              <div className="flex h-full min-w-[180px] max-w-[220px] cursor-pointer items-center gap-2 rounded-t-lg border-t border-l border-r border-gray-200 bg-white px-3 dark:border-gray-800 dark:bg-[#12151c] relative before:absolute before:top-0 before:left-0 before:w-full before:h-0.5 before:bg-[#4f8ef7] before:rounded-t-lg">
                <MethodText method="GET" />
                <span className="truncate text-xs font-medium text-gray-900 dark:text-gray-200">Get Products</span>
                <button className="ml-auto flex h-5 w-5 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <X size={12} />
                </button>
              </div>
              <div className="flex h-[calc(100%-4px)] min-w-[160px] max-w-[200px] cursor-pointer items-center gap-2 rounded-t-lg px-3 hover:bg-gray-200/50 dark:hover:bg-[#181c25] text-gray-500 dark:text-gray-400">
                <MethodText method="POST" />
                <span className="truncate text-xs">Create Order</span>
              </div>
              <button className="ml-1 flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200/80 dark:hover:bg-[#181c25] text-gray-500 mb-0.5">
                <Plus size={14} />
              </button>
            </div>

            {/* --- ADDRESS BAR --- */}
            <div className="flex shrink-0 items-center gap-2 p-3 bg-white dark:bg-[#12151c]">
              <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-[#4f8ef7] focus-within:ring-4 focus-within:ring-[#4f8ef7]/10 dark:border-gray-800 dark:bg-[#0d0f14] transition-all overflow-hidden h-10">
                <div className="flex h-full cursor-pointer items-center gap-1 border-r border-gray-200 bg-gray-50/80 px-4 text-xs font-bold hover:bg-gray-100 dark:border-gray-800 dark:bg-[#181c25] dark:hover:bg-gray-800/80 transition-colors">
                  <MethodText method="GET" />
                  <ChevronDown size={14} className="text-gray-500 ml-1" />
                </div>
                <input 
                  type="text" 
                  defaultValue="{{baseUrl}}/api/v1/products"
                  className="flex-1 bg-transparent px-4 py-2 text-[13px] font-mono text-gray-800 outline-none dark:text-gray-200 placeholder-gray-400"
                  placeholder="Nhập URL API..."
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={isSending}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f8ef7] px-6 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {isSending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                ) : (
                  <>Send <Play size={12} fill="currentColor" /></>
                )}
              </button>
            </div>

            {/* --- SPLIT PANE: REQUEST & RESPONSE --- */}
            <div className="flex flex-1 overflow-hidden border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d0f14]">
              
              {/* --- REQUEST PANE (Left) --- */}
              <div className="flex flex-1 flex-col border-r border-gray-200 dark:border-gray-800 min-w-[300px]">
                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 px-3 pt-2 dark:border-gray-800 overflow-x-auto hide-scrollbar">
                  {['Params', 'Headers', 'Body', 'Auth', 'Scripts'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveReqTab(tab)}
                      className={`relative px-3 py-1.5 text-[12px] font-medium transition-colors rounded-t-md ${
                        activeReqTab === tab 
                          ? 'text-[#4f8ef7] bg-[#4f8ef7]/10 dark:bg-[#4f8ef7]/10' 
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-[#181c25]'
                      }`}
                    >
                      {tab}
                      {tab === 'Headers' && <span className="ml-1.5 rounded-full bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[9px] text-gray-600 dark:text-gray-300">6</span>}
                      {activeReqTab === tab && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#4f8ef7]" />}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Params Tab */}
                  {activeReqTab === 'Params' && (
                    <div className="flex flex-col min-h-full bg-white dark:bg-[#12151c]">
                      <div className="flex border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#0d0f14]">
                        <div className="w-8"></div>
                        <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">Key</div>
                        <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">Value</div>
                        <div className="flex-1 py-2 px-3">Description</div>
                      </div>
                      <KeyValueRow defaultKey="category" defaultVal="electronics" defaultDesc="Lọc theo danh mục" />
                      <KeyValueRow defaultKey="limit" defaultVal="20" defaultDesc="Số lượng tối đa" />
                      <KeyValueRow defaultKey="sort" defaultVal="price_desc" defaultDesc="" />
                      <KeyValueRow isNew={true} />
                    </div>
                  )}

                  {/* Headers Tab */}
                  {activeReqTab === 'Headers' && (
                    <div className="flex flex-col min-h-full bg-white dark:bg-[#12151c]">
                      <div className="flex border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#0d0f14]">
                        <div className="w-8"></div>
                        <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">Key</div>
                        <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">Value</div>
                        <div className="flex-1 py-2 px-3">Description</div>
                      </div>
                      <KeyValueRow defaultKey="Accept" defaultVal="application/json" defaultDesc="Auto-generated" />
                      <KeyValueRow defaultKey="Content-Type" defaultVal="application/json" defaultDesc="Auto-generated" />
                      <KeyValueRow defaultKey="Authorization" defaultVal="Bearer {{token}}" defaultDesc="From Auth tab" />
                      <KeyValueRow isNew={true} />
                    </div>
                  )}

                  {/* Body Tab */}
                  {activeReqTab === 'Body' && (
                    <div className="flex flex-col h-full bg-white dark:bg-[#12151c]">
                      <div className="flex items-center gap-2 p-2 border-b border-gray-100 dark:border-gray-800/80">
                        {['none', 'JSON', 'Form Data', 'x-www-form-urlencoded', 'XML', 'Raw'].map(type => (
                          <button
                            key={type}
                            onClick={() => setBodyType(type)}
                            className={`px-3 py-1 text-[11px] rounded-md transition-colors ${bodyType === type ? 'bg-gray-200/80 text-gray-900 font-medium dark:bg-[#232834] dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#181c25]'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {bodyType === 'JSON' ? (
                        <div className="flex flex-1 relative font-mono text-[13px] group">
                          {/* Fake Line Numbers */}
                          <div className="w-10 flex flex-col items-end py-3 pr-3 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#0d0f14] border-r border-gray-100 dark:border-gray-800/80 select-none text-[11px]">
                            <span>1</span><span>2</span><span>3</span><span>4</span>
                          </div>
                          <textarea 
                            className="flex-1 bg-transparent p-3 outline-none resize-none text-gray-800 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-700 leading-relaxed focus:ring-inset focus:ring-1 focus:ring-[#4f8ef7]/20"
                            defaultValue={`{\n  "name": "Mechanical Keyboard",\n  "price": 129.99,\n  "category": "electronics"\n}`}
                            spellCheck="false"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center justify-center text-gray-400 flex-col gap-2">
                          <Braces size={24} className="opacity-20" />
                          <span>This body type is not implemented in mock</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auth Tab */}
                  {activeReqTab === 'Auth' && (
                    <div className="flex h-full bg-white dark:bg-[#12151c]">
                      <div className="w-48 border-r border-gray-100 dark:border-gray-800/80 p-2">
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Type</div>
                        <div className="flex flex-col gap-0.5">
                          {['No Auth', 'Bearer', 'Basic Auth', 'API Key', 'OAuth 2.0'].map(type => (
                            <button
                              key={type}
                              onClick={() => setAuthType(type)}
                              className={`text-left px-3 py-1.5 text-[12px] rounded-md transition-colors ${authType === type ? 'bg-[#4f8ef7]/10 text-[#4f8ef7] font-medium' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#181c25]'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        {authType === 'Bearer' && (
                          <div className="max-w-md space-y-4">
                            <div>
                              <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Token</label>
                              <div className="relative">
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" defaultValue="eyJh...mock...token" className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#4f8ef7] focus:ring-2 focus:ring-[#4f8ef7]/20 dark:border-gray-700 dark:bg-[#0d0f14] transition-all" />
                              </div>
                            </div>
                            <p className="text-[11px] text-gray-500">Bearer token sẽ tự động được thêm vào <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Authorization</span> header.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Scripts Tab */}
                  {activeReqTab === 'Scripts' && (
                    <div className="flex flex-col h-full bg-white dark:bg-[#12151c]">
                      <div className="flex gap-2 p-2 border-b border-gray-100 dark:border-gray-800/80">
                        <button className="px-3 py-1 text-[11px] rounded-md bg-gray-200/80 text-gray-900 font-medium dark:bg-[#232834] dark:text-white">Pre-request</button>
                        <button className="px-3 py-1 text-[11px] rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#181c25]">Post-response</button>
                      </div>
                      <div className="flex flex-1 relative font-mono text-[13px]">
                        <div className="w-10 flex flex-col items-end py-3 pr-3 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#0d0f14] border-r border-gray-100 dark:border-gray-800/80 select-none text-[11px]">
                          <span>1</span><span>2</span>
                        </div>
                        <textarea 
                          className="flex-1 bg-transparent p-3 outline-none resize-none text-gray-800 dark:text-gray-300 placeholder-gray-400/50 leading-relaxed"
                          placeholder="// Viết script JavaScript ở đây..."
                          defaultValue={`// Thêm timestamp vào header\nreq.setHeader('X-Timestamp', Date.now());`}
                          spellCheck="false"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- RESPONSE PANE (Right) --- */}
              <div className="flex flex-1 flex-col bg-white dark:bg-[#12151c] min-w-[300px]">
                {showResponse ? (
                  <>
                    {/* Status Bar */}
                    <div className="flex items-center justify-between border-b border-gray-200/80 px-4 py-2 bg-gray-50/50 dark:border-gray-800/80 dark:bg-[#0d0f14]/50 shrink-0">
                      <div className="flex items-center gap-4 text-[12px] font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> 200 OK
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock size={12}/> <span className="font-semibold text-gray-700 dark:text-gray-300">124 ms</span></span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><FileJson size={12}/> <span className="font-semibold text-gray-700 dark:text-gray-300">2.4 KB</span></span>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={copyToClipboard} className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-[#181c25] dark:text-gray-300 dark:hover:bg-gray-800 transition-all">
                           {copied ? <Check size={12} className="text-green-500"/> : <Copy size={12} />}
                           {copied ? 'Copied' : 'Copy'}
                         </button>
                      </div>
                    </div>

                    {/* Response Tabs */}
                    <div className="flex gap-1 border-b border-gray-200/80 px-3 pt-2 dark:border-gray-800/80 overflow-x-auto hide-scrollbar shrink-0">
                      {['Body', 'Headers', 'Cookies', 'Timeline'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setResponseTab(tab)}
                          className={`relative px-3 py-1.5 text-[12px] font-medium transition-colors rounded-t-md ${
                            responseTab === tab 
                              ? 'text-[#4f8ef7] bg-[#4f8ef7]/10 dark:bg-[#4f8ef7]/10' 
                              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-[#181c25]'
                          }`}
                        >
                          {tab}
                          {responseTab === tab && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#4f8ef7]" />}
                        </button>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-[#0d0f14]/30">
                      {responseTab === 'Body' && (
                        <div className="p-4 font-mono text-[13px] leading-relaxed">
                          <pre className="text-gray-800 dark:text-gray-300">
<span className="text-gray-400">{`{`}</span>
<br/>  <span className="text-blue-600 dark:text-[#4f8ef7]">"status"</span><span className="text-gray-400">:</span> <span className="text-green-600 dark:text-green-400">"success"</span><span className="text-gray-400">,</span>
<br/>  <span className="text-blue-600 dark:text-[#4f8ef7]">"data"</span><span className="text-gray-400">:</span> <span className="text-gray-400">{`[`}</span>
<br/>    <span className="text-gray-400">{`{`}</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"id"</span><span className="text-gray-400">:</span> <span className="text-orange-500">101</span><span className="text-gray-400">,</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"name"</span><span className="text-gray-400">:</span> <span className="text-green-600 dark:text-green-400">"Mechanical Keyboard"</span><span className="text-gray-400">,</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"price"</span><span className="text-gray-400">:</span> <span className="text-orange-500">129.99</span><span className="text-gray-400">,</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"tags"</span><span className="text-gray-400">:</span> <span className="text-gray-400">[</span><span className="text-green-600 dark:text-green-400">"tech"</span><span className="text-gray-400">,</span> <span className="text-green-600 dark:text-green-400">"gaming"</span><span className="text-gray-400">],</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"inStock"</span><span className="text-gray-400">:</span> <span className="text-purple-600 dark:text-purple-400">true</span>
<br/>    <span className="text-gray-400">{`},`}</span>
<br/>    <span className="text-gray-400">{`{`}</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"id"</span><span className="text-gray-400">:</span> <span className="text-orange-500">102</span><span className="text-gray-400">,</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"name"</span><span className="text-gray-400">:</span> <span className="text-green-600 dark:text-green-400">"Wireless Mouse"</span><span className="text-gray-400">,</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"price"</span><span className="text-gray-400">:</span> <span className="text-orange-500">49.50</span><span className="text-gray-400">,</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"tags"</span><span className="text-gray-400">:</span> <span className="text-gray-400">[</span><span className="text-green-600 dark:text-green-400">"office"</span><span className="text-gray-400">],</span>
<br/>      <span className="text-blue-600 dark:text-[#4f8ef7]">"inStock"</span><span className="text-gray-400">:</span> <span className="text-purple-600 dark:text-purple-400">false</span>
<br/>    <span className="text-gray-400">{`}`}</span>
<br/>  <span className="text-gray-400">{`]`}</span>
<br/><span className="text-gray-400">{`}`}</span>
                          </pre>
                        </div>
                      )}
                      
                      {responseTab === 'Headers' && (
                        <div className="flex flex-col min-h-full bg-white dark:bg-[#12151c]">
                          <div className="flex border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#0d0f14]">
                            <div className="w-1/2 py-2 px-4 border-r border-gray-200 dark:border-gray-800">Name</div>
                            <div className="w-1/2 py-2 px-4">Value</div>
                          </div>
                          {[
                            ['content-type', 'application/json; charset=utf-8'],
                            ['cache-control', 'public, max-age=0, must-revalidate'],
                            ['x-powered-by', 'Express'],
                            ['date', new Date().toUTCString()],
                            ['connection', 'keep-alive']
                          ].map(([k, v], i) => (
                            <div key={i} className="flex border-b border-gray-100 dark:border-gray-800/60 font-mono text-[12px] hover:bg-gray-50 dark:hover:bg-[#181c25]">
                              <div className="w-1/2 py-2 px-4 border-r border-gray-100 dark:border-gray-800/60 text-gray-600 dark:text-gray-400">{k}</div>
                              <div className="w-1/2 py-2 px-4 text-gray-800 dark:text-gray-300 break-all">{v}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-[#0d0f14]/50">
                    <TerminalSquare size={48} className="mb-4 opacity-10" strokeWidth={1} />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hit Send to get a response</span>
                    <span className="text-[11px] mt-1 opacity-60">or press <kbd className="font-sans px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">Ctrl</kbd> + <kbd className="font-sans px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">Enter</kbd></span>
                  </div>
                )}
              </div>

            </div>
          </main>
        </div>

        {/* --- BOTTOM STATUS BAR --- */}
        <footer className="flex h-7 shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50 px-3 text-[11px] text-gray-500 dark:border-gray-800 dark:bg-[#0d0f14] dark:text-gray-400 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors">
              <Database size={12} className="text-green-500" />
              <span>IndexedDB: Connected</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors">
              <Layout size={12} />
              <span>Workspace: Personal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Offline Mode Ready</span>
            </div>
            <span>Localman v1.0.0</span>
          </div>
        </footer>

      </div>
    </div>
  );
}