import {
  ArrowRightCircle,
  ChevronDown,
  Columns,
  Copy,
  Play,
  Plus,
  Rows,
  X,
  XCircle,
} from 'lucide-react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { mapCurlToRequest, parseCurl } from '../../lib/curl-parser';
import { useRequestStore } from '../../stores/request-store';
import type { TypeHttpMethod } from '../../Types/models';
import { MethodText } from '../common/MethodText';
import { Button } from '../ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface IProps {
  handleSend: () => void;
  isSending: boolean;
  layoutDirection: 'horizontal' | 'vertical';
  setLayoutDirection: (val: 'horizontal' | 'vertical') => void;
}

export const AddressBar: React.FC<IProps> = ({ handleSend, isSending, layoutDirection, setLayoutDirection }) => {
  const { t } = useTranslation();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const {
    openTabs,
    activeTabId,
    activeRequest,
    updateActiveRequest,
    closeTab,
    saveRequest,
    createNewRequest,
    closeOthers,
    closeToTheRight,
    duplicateTab,
    switchTab,
  } = useRequestStore();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateActiveRequest({ url: e.target.value });
  };

  const handleMethodChange = (method: TypeHttpMethod) => {
    updateActiveRequest({ method });
    saveRequest();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim().startsWith('curl')) {
      const parsedRes = parseCurl(pastedText);
      if (parsedRes) {
        e.preventDefault();
        const update = mapCurlToRequest(parsedRes);
        updateActiveRequest(update);
        saveRequest();
      }
    }
  };

  const httpMethods: TypeHttpMethod[] = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS',
  ];

  return (
    <>
      <div
        ref={tabsContainerRef}
        onWheel={handleWheel}
        className="flex h-11 shrink-0 items-end border-b border-gray-200 dark:border-gray-800 px-2 pt-2 bg-gray-50 dark:bg-[#181c25] overflow-x-auto hide-scrollbar select-none"
      >
        {openTabs.map((tab) => (
          <ContextMenu key={tab.id}>
            <ContextMenuTrigger asChild>
              <div
                className={`flex h-full min-w-[140px] max-w-[200px] cursor-pointer items-center gap-2 rounded-t-lg px-3 transition-all relative ${
                  activeTabId === tab.id
                    ? 'bg-white dark:bg-[#0B0E14] border border-b-0 border-gray-200 dark:border-gray-800 z-10'
                    : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                }`}
                onClick={async () => {
                  switchTab(tab.id);
                }}
              >
                <MethodText method={tab.method as TypeHttpMethod} />
                <span
                  className={`truncate text-[11px] ${activeTabId === tab.id ? 'font-semibold text-gray-900 dark:text-gray-100' : ''}`}
                >
                  {tab.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="ml-auto flex h-4 w-4 items-center justify-center rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  title={t('addressBar.closeTab')}
                >
                  <X size={10} />
                </button>
                {activeTabId === tab.id && (
                  <div className="absolute -top-[1px] left-0 w-full h-[2px] bg-[#4f8ef7] rounded-t-lg" />
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuItem
                className="gap-2"
                onClick={() => duplicateTab(tab.id)}
              >
                <Copy size={14} /> {t('common.duplicate', 'Duplicate')}
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                className="gap-2"
                onClick={() => closeTab(tab.id)}
              >
                <X size={14} /> {t('common.close', 'Close')}
              </ContextMenuItem>
              <ContextMenuItem
                className="gap-2"
                onClick={() => closeOthers(tab.id)}
              >
                <XCircle size={14} /> {t('common.closeOthers', 'Close Others')}
              </ContextMenuItem>
              <ContextMenuItem
                className="gap-2"
                onClick={() => closeToTheRight(tab.id)}
              >
                <ArrowRightCircle size={14} />{' '}
                {t('common.closeToRight', 'Close to the Right')}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => createNewRequest()}
          className="ml-1 h-7 w-7 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-1"
          title={t('addressBar.newRequest')}
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="flex shrink-0 items-center gap-2 p-3 bg-white dark:bg-[#0B0E14]">
        {activeRequest ? (
          <div className="flex flex-1 items-center rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181c25] shadow-sm focus-within:border-[#4f8ef7] focus-within:ring-2 focus-within:ring-[#4f8ef7]/10 transition-all overflow-hidden h-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex h-full cursor-pointer items-center gap-1 border-r border-gray-200 dark:border-gray-800 bg-transparent px-4 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
                  <MethodText method={activeRequest.method} />
                  <ChevronDown size={14} className="text-gray-500 ml-1" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[120px]">
                {httpMethods.map((m) => (
                  <DropdownMenuItem
                    key={m}
                    onClick={() => handleMethodChange(m)}
                    className="cursor-pointer"
                  >
                    <MethodText method={m} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              type="text"
              value={activeRequest.url || ''}
              onChange={handleUrlChange}
              onPaste={handlePaste}
              onBlur={() => saveRequest()}
              className="flex-1 bg-transparent px-4 py-2 text-[13px] font-mono text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400 w-full"
              placeholder={t('addressBar.urlPlaceholder')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181c25] h-10 px-4 text-gray-400 text-[13px] italic">
            {t('addressBar.selectRequest')}
          </div>
        )}
        <Button
          onClick={() => setLayoutDirection(layoutDirection === 'horizontal' ? 'vertical' : 'horizontal')}
          className="h-10 w-10 p-0 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#181c25] hover:bg-gray-100 dark:hover:bg-[#232834] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title={layoutDirection === 'horizontal' ? t('addressBar.layoutVertical', 'Switch to Vertical Layout') : t('addressBar.layoutHorizontal', 'Switch to Horizontal Layout')}
        >
          {layoutDirection === 'horizontal' ? <Rows size={16} /> : <Columns size={16} />}
        </Button>
        <Button
          onClick={handleSend}
          disabled={isSending || !activeRequest}
          className="h-10 rounded-lg px-6 text-xs font-semibold bg-[#4f8ef7] hover:bg-[#3b7de4] text-white shadow-lg shadow-blue-500/20 active:scale-95 disabled:active:scale-100 transition-all"
        >
          {isSending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
          ) : (
            <div className="flex items-center gap-2">
              {t('addressBar.send')} <Play size={12} fill="currentColor" />
            </div>
          )}
        </Button>
      </div>
    </>
  );
};
