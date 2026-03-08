import { Braces, Lock } from "lucide-react";
import React from "react";
import { KeyValueRow } from "../common/KeyValueRow";

interface IProps {
  activeReqTab: string;
  setActiveReqTab: (tab: string) => void;
  bodyType: string;
  setBodyType: (type: string) => void;
  authType: string;
  setAuthType: (type: string) => void;
}

export const RequestPane: React.FC<IProps> = ({
  activeReqTab,
  setActiveReqTab,
  bodyType,
  setBodyType,
  authType,
  setAuthType,
}) => {
  return (
    <div className="flex flex-1 flex-col border-r border-gray-200 dark:border-gray-800 min-w-[300px]">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 px-3 pt-2 dark:border-gray-800 overflow-x-auto hide-scrollbar">
        {["Params", "Headers", "Body", "Auth", "Scripts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveReqTab(tab)}
            className={`relative px-3 py-1.5 text-[12px] font-medium transition-colors rounded-t-md ${
              activeReqTab === tab
                ? "text-[#4f8ef7] bg-[#4f8ef7]/10 dark:bg-[#4f8ef7]/10"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-[#181c25]"
            }`}
          >
            {tab}
            {tab === "Headers" && (
              <span className="ml-1.5 rounded-full bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[9px] text-gray-600 dark:text-gray-300">
                6
              </span>
            )}
            {activeReqTab === tab && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#4f8ef7]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Params Tab */}
        {activeReqTab === "Params" && (
          <div className="flex flex-col min-h-full bg-white dark:bg-[#12151c]">
            <div className="flex border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#0d0f14]">
              <div className="w-8"></div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                Key
              </div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                Value
              </div>
              <div className="flex-1 py-2 px-3">Description</div>
            </div>
            <KeyValueRow
              defaultKey="category"
              defaultVal="electronics"
              defaultDesc="Lọc theo danh mục"
            />
            <KeyValueRow
              defaultKey="limit"
              defaultVal="20"
              defaultDesc="Số lượng tối đa"
            />
            <KeyValueRow
              defaultKey="sort"
              defaultVal="price_desc"
              defaultDesc=""
            />
            <KeyValueRow isNew={true} />
          </div>
        )}

        {/* Headers Tab */}
        {activeReqTab === "Headers" && (
          <div className="flex flex-col min-h-full bg-white dark:bg-[#12151c]">
            <div className="flex border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#0d0f14]">
              <div className="w-8"></div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                Key
              </div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                Value
              </div>
              <div className="flex-1 py-2 px-3">Description</div>
            </div>
            <KeyValueRow
              defaultKey="Accept"
              defaultVal="application/json"
              defaultDesc="Auto-generated"
            />
            <KeyValueRow
              defaultKey="Content-Type"
              defaultVal="application/json"
              defaultDesc="Auto-generated"
            />
            <KeyValueRow
              defaultKey="Authorization"
              defaultVal="Bearer {{token}}"
              defaultDesc="From Auth tab"
            />
            <KeyValueRow isNew={true} />
          </div>
        )}

        {/* Body Tab */}
        {activeReqTab === "Body" && (
          <div className="flex flex-col h-full bg-white dark:bg-[#12151c]">
            <div className="flex items-center gap-2 p-2 border-b border-gray-100 dark:border-gray-800/80">
              {[
                "none",
                "JSON",
                "Form Data",
                "x-www-form-urlencoded",
                "XML",
                "Raw",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => setBodyType(type)}
                  className={`px-3 py-1 text-[11px] rounded-md transition-colors ${bodyType === type ? "bg-gray-200/80 text-gray-900 font-medium dark:bg-[#232834] dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#181c25]"}`}
                >
                  {type}
                </button>
              ))}
            </div>
            {bodyType === "JSON" ? (
              <div className="flex flex-1 relative font-mono text-[13px] group">
                <div className="w-10 flex flex-col items-end py-3 pr-3 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#0d0f14] border-r border-gray-100 dark:border-gray-800/80 select-none text-[11px]">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
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
        {activeReqTab === "Auth" && (
          <div className="flex h-full bg-white dark:bg-[#12151c]">
            <div className="w-48 border-r border-gray-100 dark:border-gray-800/80 p-2">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                Type
              </div>
              <div className="flex flex-col gap-0.5">
                {[
                  "No Auth",
                  "Bearer",
                  "Basic Auth",
                  "API Key",
                  "OAuth 2.0",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAuthType(type)}
                    className={`text-left px-3 py-1.5 text-[12px] rounded-md transition-colors ${authType === type ? "bg-[#4f8ef7]/10 text-[#4f8ef7] font-medium" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#181c25]"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 p-6">
              {authType === "Bearer" && (
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Token
                    </label>
                    <div className="relative">
                      <Lock
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        defaultValue="eyJh...mock...token"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#4f8ef7] focus:ring-2 focus:ring-[#4f8ef7]/20 dark:border-gray-700 dark:bg-[#0d0f14] transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Bearer token sẽ tự động được thêm vào{" "}
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                      Authorization
                    </span>{" "}
                    header.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scripts Tab */}
        {activeReqTab === "Scripts" && (
          <div className="flex flex-col h-full bg-white dark:bg-[#12151c]">
            <div className="flex gap-2 p-2 border-b border-gray-100 dark:border-gray-800/80">
              <button className="px-3 py-1 text-[11px] rounded-md bg-gray-200/80 text-gray-900 font-medium dark:bg-[#232834] dark:text-white">
                Pre-request
              </button>
              <button className="px-3 py-1 text-[11px] rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#181c25]">
                Post-response
              </button>
            </div>
            <div className="flex flex-1 relative font-mono text-[13px]">
              <div className="w-10 flex flex-col items-end py-3 pr-3 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#0d0f14] border-r border-gray-100 dark:border-gray-800/80 select-none text-[11px]">
                <span>1</span>
                <span>2</span>
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
  );
};
