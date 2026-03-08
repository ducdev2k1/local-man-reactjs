import { ChevronDown, Play, Plus, X } from 'lucide-react';
import React from 'react';
import { useRequestStore } from '../../stores/request-store';
import { MethodText } from '../common/MethodText';

interface IProps {
  handleSend: () => void;
  isSending: boolean;
}

export const AddressBar: React.FC<IProps> = ({ handleSend, isSending }) => {
  const {
    openTabs,
    activeTabId,
    activeRequest,
    updateActiveRequest,
    closeTab,
    saveRequest,
  } = useRequestStore();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateActiveRequest({ url: e.target.value });
  };

  return (
    <>
      <div className="flex h-10 shrink-0 items-end border-b border-gray-200 dark:border-gray-800 px-2 pt-2 bg-gray-50 dark:bg-[#0d0f14] overflow-x-auto hide-scrollbar">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex h-full min-w-[160px] max-w-[220px] cursor-pointer items-center gap-2 rounded-t-lg px-3 transition-colors ${
              activeTabId === tab.id
                ? 'border-t border-l border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#12151c] relative before:absolute before:top-0 before:left-0 before:w-full before:h-0.5 before:bg-[#4f8ef7] before:rounded-t-lg'
                : 'hover:bg-gray-200/50 dark:hover:bg-[#181c25] text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => {}}
          >
            <MethodText method={tab.method} />
            <span
              className={`truncate text-xs ${activeTabId === tab.id ? 'font-medium text-gray-900 dark:text-gray-200' : ''}`}
            >
              {tab.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="ml-auto flex h-5 w-5 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              title="Close Tab"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button className="ml-1 flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200/80 dark:hover:bg-[#181c25] text-gray-500 mb-0.5">
          <Plus size={14} />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2 p-3 bg-white dark:bg-[#12151c]">
        {activeRequest ? (
          <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-[#4f8ef7] focus-within:ring-4 focus-within:ring-[#4f8ef7]/10 dark:border-gray-800 dark:bg-[#0d0f14] transition-all overflow-hidden h-10">
            <div className="flex h-full cursor-pointer items-center gap-1 border-r border-gray-200 bg-gray-50/80 px-4 text-xs font-bold hover:bg-gray-100 dark:border-gray-800 dark:bg-[#181c25] dark:hover:bg-gray-800/80 transition-colors">
              <MethodText method={activeRequest.method} />
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </div>
            <input
              type="text"
              value={activeRequest.url || ''}
              onChange={handleUrlChange}
              onBlur={() => saveRequest()}
              className="flex-1 bg-transparent px-4 py-2 text-[13px] font-mono text-gray-800 outline-none dark:text-gray-200 placeholder-gray-400"
              placeholder="Nhập URL API..."
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-[#0d0f14] h-10 px-4 text-gray-400 text-[13px] italic">
            Select or create a new request...
          </div>
        )}
        <button
          onClick={handleSend}
          disabled={isSending || !activeRequest}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4f8ef7] px-6 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {isSending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
          ) : (
            <>
              Send <Play size={12} fill="currentColor" />
            </>
          )}
        </button>
      </div>
    </>
  );
};
