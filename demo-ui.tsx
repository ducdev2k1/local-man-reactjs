import {
  Box,
  CheckCircle2,
  ChevronDown,
  Clock,
  Folder,
  HardDrive,
  History,
  Monitor,
  Moon,
  Play,
  Plus,
  Search,
  Settings,
  Sun,
  WifiOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// --- THEME UTILS ---
const ThemeIcon = ({ theme }) => {
  if (theme === 'light') return <Sun className="w-4 h-4" />;
  if (theme === 'dark') return <Moon className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

// --- MOCK DATA ---
const mockCollections = [
  {
    id: '1',
    name: 'E-commerce API',
    folders: [
      {
        id: 'f1',
        name: 'Products',
        requests: [
          { id: 'r1', method: 'GET', name: 'Get All Products' },
          { id: 'r2', method: 'POST', name: 'Create Product' },
        ],
      },
      {
        id: 'f2',
        name: 'Orders',
        requests: [{ id: 'r3', method: 'GET', name: 'Get Order by ID' }],
      },
    ],
  },
  {
    id: '2',
    name: 'Auth Service',
    folders: [],
    requests: [
      { id: 'r4', method: 'POST', name: 'Login User' },
      { id: 'r5', method: 'GET', name: 'Get Profile' },
    ],
  },
];

// --- SHADCN-LIKE COMPONENTS (Tailwind styled) ---
const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    outline:
      'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
    glass:
      'bg-white/20 dark:bg-slate-900/20 backdrop-blur-md border border-white/30 dark:border-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-800/40',
  };
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    icon: 'h-10 w-10',
  };
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Badge = ({ children, method }) => {
  const methodColors = {
    GET: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    POST: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    PUT: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    DELETE: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    PATCH:
      'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${methodColors[method] || 'text-slate-500 bg-slate-100'}`}
    >
      {method}
    </span>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [theme, setTheme] = useState('system');
  const [activeTab, setActiveTab] = useState('params');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/v1/users');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Theme Management
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    setResponse(null);

    // Giả lập network delay
    setTimeout(() => {
      setResponse({
        status: 200,
        time: '124 ms',
        size: '1.2 KB',
        data: {
          success: true,
          message: 'Data fetched successfully from Localman mockup',
          data: [
            { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
            { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
          ],
          meta: {
            source_of_truth: 'IndexedDB',
            sync_status: 'pending_sync',
          },
        },
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    // Nền background với mesh gradient nổi bật để tôn lên hiệu ứng kính mờ
    <div className="min-h-screen p-3 md:p-5 flex flex-col gap-4 font-sans text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-[#0B0E14] transition-colors duration-300 relative overflow-hidden">
      {/* CSS Inject cho class .glass dựa trên mã bạn cung cấp */}
      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        /* Biến thể dành riêng cho Dark Mode để đảm bảo độ tương phản */
        .dark .glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        /* Tùy chỉnh thanh cuộn cho đẹp mắt trên nền kính */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.5); }
      `}</style>

      {/* Decorative background blobs - Cấu hình lại để phản chiếu qua kính đẹp hơn */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/30 dark:bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/30 dark:bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] rounded-full bg-teal-400/30 dark:bg-teal-600/10 blur-[100px] pointer-events-none" />

      {/* --- TOP HEADER (Titlebar) --- */}
      <header className="glass h-14 flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-1.5 rounded-lg shadow-sm">
            <Box className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Localman
          </span>
          <span className="text-xs bg-white/50 dark:bg-white/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2 font-medium border border-white/40 dark:border-white/10">
            Beta
          </span>
        </div>

        {/* Center - Workspace / Env */}
        <div className="flex items-center bg-white/40 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-3 rounded-md"
          >
            No Environment
          </Button>
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-3 rounded-md"
          >
            <Settings className="w-3.5 h-3.5 mr-1" /> Manage
          </Button>
        </div>

        {/* Right - Sync & Theme */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-black/20 px-3 py-1.5 rounded-full border border-white/50 dark:border-white/10">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-8 h-8 bg-white/40 dark:bg-black/20 border border-white/50 dark:border-white/10"
            title={`Current: ${theme}`}
          >
            <ThemeIcon theme={theme} />
          </Button>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden z-10">
        {/* SIDEBAR */}
        <aside className="glass w-full lg:w-64 flex flex-col overflow-hidden shrink-0">
          <div className="p-3 border-b border-white/30 dark:border-white/10 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
              <Input
                className="h-9 pl-8 bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/10"
                placeholder="Filter..."
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mockCollections.map((col) => (
              <div key={col.id} className="mb-2">
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/50 dark:hover:bg-white/5 rounded-md cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                  {col.name}
                </div>
                <div className="pl-6 pr-2">
                  {col.folders?.map((folder) => (
                    <div key={folder.id}>
                      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/50 dark:hover:bg-white/5 rounded-md cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors">
                        <Folder className="w-3.5 h-3.5" />
                        {folder.name}
                      </div>
                      <div className="pl-4">
                        {folder.requests?.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center gap-2 px-2 py-1 hover:bg-white/60 dark:hover:bg-white/10 rounded-md cursor-pointer text-sm truncate transition-colors"
                          >
                            <span
                              className={`text-[10px] font-bold w-8 ${
                                req.method === 'GET'
                                  ? 'text-green-600 dark:text-green-400'
                                  : req.method === 'POST'
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {req.method}
                            </span>
                            <span className="truncate text-slate-700 dark:text-slate-300">
                              {req.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {col.requests?.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-white/60 dark:hover:bg-white/10 rounded-md cursor-pointer text-sm truncate transition-colors"
                    >
                      <span
                        className={`text-[10px] font-bold w-8 ${
                          req.method === 'GET'
                            ? 'text-green-600 dark:text-green-400'
                            : req.method === 'POST'
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {req.method}
                      </span>
                      <span className="truncate text-slate-700 dark:text-slate-300">
                        {req.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/30 dark:border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 dark:text-slate-400 h-8 hover:bg-white/40 dark:hover:bg-white/5"
            >
              <History className="w-4 h-4 mr-2" /> History
            </Button>
          </div>
        </aside>

        {/* REQUEST PANE */}
        <div className="glass flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tab header */}
          <div className="flex items-center px-2 h-11 border-b border-white/30 dark:border-white/10 pt-2">
            <div className="flex items-center px-4 py-1.5 bg-white/60 dark:bg-black/30 rounded-t-lg border border-b-0 border-white/50 dark:border-white/10 text-sm font-medium gap-2">
              <Badge method={method} />
              Get All Products
              <div
                className="w-2 h-2 rounded-full bg-orange-400 ml-2"
                title="Unsaved changes"
              ></div>
            </div>
          </div>

          {/* Address Bar */}
          <div className="p-3 border-b border-white/30 dark:border-white/10 flex gap-2">
            <div className="flex flex-1 items-center border border-white/60 dark:border-white/10 rounded-lg bg-white/50 dark:bg-black/20 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-inner">
              <select
                className="h-full bg-white/40 dark:bg-white/5 px-3 text-sm font-semibold border-r border-white/40 dark:border-white/10 outline-none cursor-pointer"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent outline-none font-mono text-sm"
                placeholder="Enter request URL"
              />
            </div>
            <Button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="gap-2 px-6 rounded-lg shadow-md"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Send
            </Button>
          </div>

          {/* Request Settings Tabs */}
          <div className="flex px-3 border-b border-white/30 dark:border-white/10 mt-2 gap-1">
            {['Params', 'Auth', 'Headers (2)', 'Body', 'Scripts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase().split(' ')[0]
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white/30 dark:bg-white/5 rounded-t-md'
                    : 'border-transparent text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/5 rounded-t-md'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Request Editor Area */}
          <div className="flex-1 overflow-auto p-4">
            <div className="rounded-xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-black/30 h-full font-mono text-sm overflow-hidden flex flex-col shadow-inner">
              <div className="flex items-center px-3 py-2 border-b border-white/30 dark:border-white/10 bg-white/30 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-400 font-sans font-medium">
                {activeTab === 'params' && 'Query Parameters'}
                {activeTab === 'headers' && 'Request Headers'}
                {activeTab === 'body' && 'JSON Body'}
                {activeTab === 'auth' && 'Authorization Config'}
                {activeTab === 'scripts' && 'Pre-request Script (JS)'}
              </div>
              <textarea
                className="flex-1 w-full bg-transparent p-4 resize-none outline-none text-slate-700 dark:text-slate-300"
                spellCheck="false"
                defaultValue={
                  activeTab === 'body'
                    ? '{\n  "name": "Localman User",\n  "status": "offline_first"\n}'
                    : activeTab === 'headers'
                      ? 'Content-Type: application/json\nAccept: */*'
                      : '// Select a tab to edit'
                }
              ></textarea>
            </div>
          </div>
        </div>

        {/* RESPONSE PANE */}
        <div className="glass flex-1 flex flex-col min-w-0 overflow-hidden">
          {response ? (
            <>
              {/* Response Meta info */}
              <div className="px-4 py-2.5 border-b border-white/30 dark:border-white/10 flex items-center gap-4 bg-white/20 dark:bg-white/5">
                <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-mono text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  {response.status} OK
                </div>
                <div className="w-[1px] h-4 bg-slate-400 dark:bg-slate-600"></div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-sm">
                  <Clock className="w-4 h-4" />
                  {response.time}
                </div>
                <div className="w-[1px] h-4 bg-slate-400 dark:bg-slate-600"></div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-sm">
                  <HardDrive className="w-4 h-4" />
                  {response.size}
                </div>
                <div className="flex-1"></div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/10"
                >
                  Save Example
                </Button>
              </div>

              {/* Response Tabs */}
              <div className="flex px-3 border-b border-white/30 dark:border-white/10 gap-1 mt-1">
                <button className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white/30 dark:bg-white/5 rounded-t-md">
                  Body
                </button>
                <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-800 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-white/5 rounded-t-md">
                  Headers
                </button>
              </div>

              {/* Response Body Viewer */}
              <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                <div className="bg-white/50 dark:bg-black/40 p-4 rounded-xl border border-white/50 dark:border-white/10 h-full overflow-auto shadow-inner">
                  <pre className="text-slate-800 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">{`{`}</span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`  "success"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-orange-600 dark:text-orange-500">
                      true
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`  "message"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "Data fetched successfully from Localman mockup"
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`  "data"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      : [
                    </span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`    {`}</span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`      "id"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-purple-700 dark:text-purple-400">
                      1
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`      "name"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "Leanne Graham"
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`      "email"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "Sincere@april.biz"
                    </span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`    },`}</span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`    {`}</span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`      "id"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-purple-700 dark:text-purple-400">
                      2
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`      "name"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "Ervin Howell"
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`      "email"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "Shanna@melissa.tv"
                    </span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`    }`}</span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`  ],`}</span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`  "meta"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">{`: {`}</span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`    "source_of_truth"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "IndexedDB"
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ,
                    </span>
                    {'\n'}
                    <span className="text-blue-700 dark:text-blue-400">{`    "sync_status"`}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      :
                    </span>{' '}
                    <span className="text-green-700 dark:text-green-400">
                      "pending_sync"
                    </span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`  }`}</span>
                    {'\n'}
                    <span className="text-slate-500 dark:text-slate-400">{`}`}</span>
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-500 flex-col gap-4">
              <div className="w-24 h-24 rounded-full bg-white/40 dark:bg-black/20 flex items-center justify-center border border-white/50 dark:border-white/10 shadow-sm">
                <Play className="w-10 h-10 ml-2 opacity-50" />
              </div>
              <p className="font-medium">Hit Send to get a response</p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER / STATUS BAR */}
      <footer className="glass h-10 flex items-center justify-between px-4 text-xs text-slate-600 dark:text-slate-400 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <HardDrive className="w-3.5 h-3.5" /> DB Ready
          </span>
          <span>12 Requests</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Layout: Glassmorphism</span>
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />{' '}
            All systems go
          </span>
        </div>
      </footer>
    </div>
  );
}
