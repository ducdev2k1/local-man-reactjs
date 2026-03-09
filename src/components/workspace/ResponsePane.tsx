import { Check, Clock, Copy, FileJson, TerminalSquare } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css'; // Standard dark theme that works well
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { IApiResponse } from '../../Types/models';

interface IProps {
  showResponse: boolean;
  response: IApiResponse | null;
  responseTab: string;
  setResponseTab: (tab: string) => void;
  copied: boolean;
  copyToClipboard: () => void;
}

export const ResponsePane: React.FC<IProps> = ({
  showResponse,
  response,
  responseTab,
  setResponseTab,
  copied,
  copyToClipboard,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col min-w-[300px] transition-all bg-white dark:bg-[#0B0E14]">
      {showResponse ? (
        <>
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-gray-200/50 px-4 py-2 shrink-0">
            <div className="flex items-center gap-4 text-[12px] font-mono">
              <span
                className={`flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-md ${
                  response && response.status >= 200 && response.status < 300
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10'
                    : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                    response && response.status >= 200 && response.status < 300
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                ></span>{' '}
                {response ? `${response.status} ${response.statusText}` : '---'}
              </span>
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock size={12} />{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {response ? `${response.time} ms` : '0 ms'}
                </span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FileJson size={12} />{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {response
                    ? `${(response.size / 1024).toFixed(2)} KB`
                    : '0 KB'}
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
                {copied ? t('responsePane.copied') : t('responsePane.copy')}
              </button>
            </div>
          </div>

          {/* Response Tabs */}
          <div className="flex gap-1 border-b border-gray-200/80 px-3 pt-2 dark:border-gray-800/80 overflow-x-auto hide-scrollbar shrink-0">
            {['Body', 'Headers', 'Cookies', 'Timeline'].map((tab) => (
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
                {responseTab === tab && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#4f8ef7]" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-[#0d0f14]/30">
            {responseTab === 'Body' && (
              <div className="p-4 font-mono text-[13px] leading-relaxed">
                <pre className="text-gray-800 dark:text-gray-300 !bg-transparent !m-0 !p-0">
                  <code
                    className="language-json"
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        (() => {
                          if (!response || !response.body) return '';
                          try {
                            const parsed = JSON.parse(response.body);
                            return JSON.stringify(parsed, null, 2);
                          } catch {
                            return response.body;
                          }
                        })(),
                        Prism.languages.json,
                        'json',
                      ),
                    }}
                  />
                </pre>
              </div>
            )}

            {responseTab === 'Headers' && (
              <div className="flex flex-col min-h-full bg-transparent">
                <div className="flex border-b border-gray-200/50 dark:border-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-white/5 dark:bg-black/10">
                  <div className="w-1/2 py-2 px-4 border-r border-gray-200 dark:border-gray-800">
                    {t('common.name')}
                  </div>
                  <div className="w-1/2 py-2 px-4">{t('common.value')}</div>
                </div>
                {response &&
                  Object.entries(response.headers).map(([k, v], i) => (
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
        <div className="flex h-full flex-col items-center justify-center text-gray-400 bg-transparent">
          <TerminalSquare
            size={48}
            className="mb-4 opacity-10"
            strokeWidth={1}
          />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('responsePane.hitSend')}
          </span>
          <span className="text-[11px] mt-1 opacity-60">
            {t('responsePane.orPress')}{' '}
            <kbd className="font-sans px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="font-sans px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">
              Enter
            </kbd>
          </span>
        </div>
      )}
    </div>
  );
};
