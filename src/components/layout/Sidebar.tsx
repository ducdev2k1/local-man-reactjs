import {
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  Folder,
  Globe,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import React from "react";
import type { ICollection, IHistoryItem } from "../../Types";
import { MethodBadge } from "../common/MethodBadge";
import { MethodText } from "../common/MethodText";

interface IProps {
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;
  collections: ICollection[];
  toggleCollection: (id: string) => void;
  mockHistory: IHistoryItem[];
  sidebarWidth: number;
}

export const Sidebar: React.FC<IProps> = ({
  activeSidebarTab,
  setActiveSidebarTab,
  collections,
  toggleCollection,
  mockHistory,
  sidebarWidth,
}) => {
  return (
    <>
      {/* --- ACTIVITY BAR (Leftmost) --- */}
      <nav className="flex w-12 flex-col items-center border-r border-gray-200 bg-gray-50 py-3 dark:border-gray-800 dark:bg-[#0d0f14]">
        <div className="flex flex-col gap-2 w-full px-2">
          {[
            { id: "collections", icon: Folder, tooltip: "Collections" },
            { id: "environments", icon: Globe, tooltip: "Environments" },
            { id: "history", icon: Clock, tooltip: "History" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSidebarTab(item.id)}
              className={`relative flex h-8 w-full items-center justify-center rounded-lg transition-all duration-200 group ${
                activeSidebarTab === item.id
                  ? "bg-blue-50 text-[#4f8ef7] dark:bg-blue-500/10 dark:text-[#4f8ef7]"
                  : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-gray-200"
              }`}
            >
              <item.icon
                size={18}
                strokeWidth={activeSidebarTab === item.id ? 2.5 : 2}
              />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-sm group-hover:block dark:bg-white dark:text-gray-900 z-50 whitespace-nowrap">
                {item.tooltip}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* --- SIDEBAR PANEL --- */}
      <aside
        style={{ width: sidebarWidth }}
        className="flex flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-[#12151c]"
      >
        {activeSidebarTab === "collections" && (
          <>
            <div className="flex items-center justify-between p-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
                Collections
              </span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-white transition-colors">
                  <Plus size={14} />
                </button>
                <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-white transition-colors">
                  <Search size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {collections.map((col) => (
                <div key={col.id} className="mb-0.5 select-none">
                  <div
                    onClick={() => toggleCollection(col.id)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 px-2 hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {col.isOpen ? (
                      <ChevronDown
                        size={14}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    )}
                    <Folder
                      size={14}
                      className="text-[#4f8ef7] fill-[#4f8ef7]/20 dark:fill-[#4f8ef7]/30"
                    />
                    <span className="truncate text-xs font-medium">
                      {col.name}
                    </span>
                  </div>

                  {col.isOpen && (
                    <div className="ml-5 mt-0.5 mb-1.5 space-y-0.5 border-l border-gray-200 dark:border-gray-800">
                      {col.items.map((item) => (
                        <div
                          key={item.id}
                          className={`group flex cursor-pointer items-center justify-between rounded-md py-1.5 pl-3 pr-2 transition-colors ${item.id === "1-1" ? "bg-[#4f8ef7]/10 text-[#4f8ef7] dark:bg-[#4f8ef7]/20" : "hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-700 dark:text-gray-300"}`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <MethodBadge method={item.method} />
                            <span
                              className={`truncate text-[12px] ${item.id === "1-1" ? "font-medium text-[#4f8ef7] dark:text-[#6fa8ff]" : "dark:group-hover:text-gray-100"}`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <MoreVertical
                            size={14}
                            className="opacity-0 text-gray-400 dark:text-gray-500 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeSidebarTab === "history" && (
          <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-800">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
                History
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-[#1e2330] cursor-pointer group transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <MethodText method={h.method} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate max-w-[120px] transition-colors">
                        {h.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${h.status === 200 || h.status === 201 ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"}`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500">
                    <span>{h.time}</span>
                    <ArrowRightLeft
                      size={10}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  );
};
