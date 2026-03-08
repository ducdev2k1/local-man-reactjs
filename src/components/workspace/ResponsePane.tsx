import { Check, Clock, Copy, FileJson, TerminalSquare } from "lucide-react";
import React from "react";

interface IProps {
  showResponse: boolean;
  responseTab: string;
  setResponseTab: (tab: string) => void;
  copied: boolean;
  copyToClipboard: () => void;
}

export const ResponsePane: React.FC<IProps> = ({
  showResponse,
  responseTab,
  setResponseTab,
  copied,
  copyToClipboard,
}) => {
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-[#12151c] min-w-[300px]">
      {showResponse ? (
        <>
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-gray-200/80 px-4 py-2 bg-gray-50/50 dark:border-gray-800/80 dark:bg-[#0d0f14]/50 shrink-0">
            <div className="flex items-center gap-4 text-[12px] font-mono">
              <span className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                200 OK
              </span>
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock size={12} />{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  124 ms
                </span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FileJson size={12} />{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  2.4 KB
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-[#181c25] dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
              >
                {copied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Response Tabs */}
          <div className="flex gap-1 border-b border-gray-200/80 px-3 pt-2 dark:border-gray-800/80 overflow-x-auto hide-scrollbar shrink-0">
            {["Body", "Headers", "Cookies", "Timeline"].map((tab) => (
              <button
                key={tab}
                onClick={() => setResponseTab(tab)}
                className={`relative px-3 py-1.5 text-[12px] font-medium transition-colors rounded-t-md ${
                  responseTab === tab
                    ? "text-[#4f8ef7] bg-[#4f8ef7]/10 dark:bg-[#4f8ef7]/10"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-[#181c25]"
                }`}
              >
                {tab}
                {responseTab === tab && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#4f8ef7]" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-[#0d0f14]/30">
            {responseTab === "Body" && (
              <div className="p-4 font-mono text-[13px] leading-relaxed">
                <pre className="text-gray-800 dark:text-gray-300">
                  <span className="text-gray-400">{`{`}</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "status"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    "success"
                  </span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "data"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-gray-400">{`[`}</span>
                  <br /> <span className="text-gray-400">{`{`}</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "id"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-orange-500">101</span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "name"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    "Mechanical Keyboard"
                  </span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "price"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-orange-500">129.99</span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "tags"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-gray-400">[</span>
                  <span className="text-green-600 dark:text-green-400">
                    "tech"
                  </span>
                  <span className="text-gray-400">,</span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    "gaming"
                  </span>
                  <span className="text-gray-400">],</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "inStock"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-purple-600 dark:text-purple-400">
                    true
                  </span>
                  <br /> <span className="text-gray-400">{`},`}</span>
                  <br /> <span className="text-gray-400">{`{`}</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "id"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-orange-500">102</span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "name"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    "Wireless Mouse"
                  </span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "price"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-orange-500">49.50</span>
                  <span className="text-gray-400">,</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "tags"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-gray-400">[</span>
                  <span className="text-green-600 dark:text-green-400">
                    "office"
                  </span>
                  <span className="text-gray-400">],</span>
                  <br />{" "}
                  <span className="text-blue-600 dark:text-[#4f8ef7]">
                    "inStock"
                  </span>
                  <span className="text-gray-400">:</span>{" "}
                  <span className="text-purple-600 dark:text-purple-400">
                    false
                  </span>
                  <br /> <span className="text-gray-400">{`}`}</span>
                  <br /> <span className="text-gray-400">{`]`}</span>
                  <br />
                  <span className="text-gray-400">{`}`}</span>
                </pre>
              </div>
            )}

            {responseTab === "Headers" && (
              <div className="flex flex-col min-h-full bg-white dark:bg-[#12151c]">
                <div className="flex border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#0d0f14]">
                  <div className="w-1/2 py-2 px-4 border-r border-gray-200 dark:border-gray-800">
                    Name
                  </div>
                  <div className="w-1/2 py-2 px-4">Value</div>
                </div>
                {[
                  ["content-type", "application/json; charset=utf-8"],
                  ["cache-control", "public, max-age=0, must-revalidate"],
                  ["x-powered-by", "Express"],
                  ["date", new Date().toUTCString()],
                  ["connection", "keep-alive"],
                ].map(([k, v], i) => (
                  <div
                    key={i}
                    className="flex border-b border-gray-100 dark:border-gray-800/60 font-mono text-[12px] hover:bg-gray-50 dark:hover:bg-[#181c25]"
                  >
                    <div className="w-1/2 py-2 px-4 border-r border-gray-100 dark:border-gray-800/60 text-gray-600 dark:text-gray-400">
                      {k}
                    </div>
                    <div className="w-1/2 py-2 px-4 text-gray-800 dark:text-gray-300 break-all">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-[#0d0f14]/50">
          <TerminalSquare
            size={48}
            className="mb-4 opacity-10"
            strokeWidth={1}
          />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Hit Send to get a response
          </span>
          <span className="text-[11px] mt-1 opacity-60">
            or press{" "}
            <kbd className="font-sans px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="font-sans px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">
              Enter
            </kbd>
          </span>
        </div>
      )}
    </div>
  );
};
