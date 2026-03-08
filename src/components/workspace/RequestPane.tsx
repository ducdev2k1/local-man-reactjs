import { Braces, Lock } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequestStore } from '../../stores/request-store';
import type { TypeAuthType, TypeBodyType } from '../../Types/models';
import { KeyValueRow } from '../common/KeyValueRow';

interface IProps {
  activeReqTab: string;
  setActiveReqTab: (tab: string) => void;
}

export const RequestPane: React.FC<IProps> = ({
  activeReqTab,
  setActiveReqTab,
}) => {
  const { t } = useTranslation();
  const { activeRequest, updateActiveRequest } = useRequestStore();

  if (!activeRequest) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400 dark:border-gray-800 min-w-[300px] border-r border-gray-200">
        {t('requestPane.noActive')}
      </div>
    );
  }

  const setBodyType = (type: string) => {
    updateActiveRequest({
      body: { ...activeRequest.body, type: type as TypeBodyType },
    });
  };

  const setAuthType = (type: string) => {
    updateActiveRequest({
      auth: { ...activeRequest.auth, type: type as TypeAuthType },
    });
  };

  const bodyType = activeRequest.body.type || 'none';
  const authType = activeRequest.auth.type || 'No Auth';

  return (
    <div className="flex flex-1 flex-col border-r border-gray-200/50 min-w-[300px] transition-all">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200/50 px-3 pt-2 overflow-x-auto hide-scrollbar">
        {['Params', 'Headers', 'Body', 'Auth', 'Scripts'].map((tab) => (
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
            {tab === 'Headers' && (
              <span className="ml-1.5 rounded-full bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[9px] text-gray-600 dark:text-gray-300">
                {activeRequest.headers.length || 0}
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
        {activeReqTab === 'Params' && (
          <div className="flex flex-col min-h-full bg-transparent">
            <div className="flex border-b border-gray-200/50 dark:border-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-white/5 dark:bg-black/10">
              <div className="w-8"></div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                {t('common.key')}
              </div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                {t('common.value')}
              </div>
              <div className="flex-1 py-2 px-3">{t('common.description')}</div>
            </div>
            {activeRequest.params.map((p) => (
              <KeyValueRow
                key={p.id}
                defaultKey={p.key}
                defaultVal={p.value}
                defaultDesc={p.description}
              />
            ))}
            <KeyValueRow isNew={true} />
          </div>
        )}

        {/* Similar updates cut for brevity assuming full implementation in components */}
        {activeReqTab === 'Headers' && (
          <div className="flex flex-col min-h-full bg-transparent">
            <div className="flex border-b border-gray-200/50 dark:border-gray-800/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-white/5 dark:bg-black/10">
              <div className="w-8"></div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                {t('common.key')}
              </div>
              <div className="w-1/3 py-2 px-3 border-r border-gray-200 dark:border-gray-800">
                {t('common.value')}
              </div>
              <div className="flex-1 py-2 px-3">{t('common.description')}</div>
            </div>
            {activeRequest.headers.map((h) => (
              <KeyValueRow
                key={h.id}
                defaultKey={h.key}
                defaultVal={h.value}
                defaultDesc={h.description}
              />
            ))}
            <KeyValueRow isNew={true} />
          </div>
        )}

        {activeReqTab === 'Body' && (
          <div className="flex flex-col h-full bg-transparent">
            <div className="flex items-center gap-2 p-2 border-b border-gray-100 dark:border-gray-800/80">
              {[
                'none',
                'JSON',
                'Form Data',
                'x-www-form-urlencoded',
                'XML',
                'Raw',
              ].map((type) => (
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
                <div className="w-10 flex flex-col items-end py-3 pr-3 text-gray-400 dark:text-gray-600 bg-white/5 dark:bg-black/10 border-r border-gray-100/50 dark:border-gray-800/50 select-none text-[11px]">
                  <span>1</span>
                </div>
                <textarea
                  className="flex-1 bg-transparent p-3 outline-none resize-none text-gray-800 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-700 leading-relaxed focus:ring-inset focus:ring-1 focus:ring-[#4f8ef7]/20"
                  value={activeRequest.body.content || ''}
                  onChange={(e) =>
                    updateActiveRequest({
                      body: { ...activeRequest.body, content: e.target.value },
                    })
                  }
                  spellCheck="false"
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray-400 flex-col gap-2">
                <Braces size={24} className="opacity-20" />
                <span>{t('requestPane.bodyNotImpl')}</span>
              </div>
            )}
          </div>
        )}

        {activeReqTab === 'Auth' && (
          <div className="flex h-full bg-transparent">
            <div className="w-48 border-r border-gray-100/50 dark:border-gray-800/50 p-2">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                {t('requestPane.type')}
              </div>
              <div className="flex flex-col gap-0.5">
                {[
                  'No Auth',
                  'Bearer',
                  'Basic Auth',
                  'API Key',
                  'OAuth 2.0',
                ].map((type) => (
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
                    <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('requestPane.token')}
                    </label>
                    <div className="relative">
                      <Lock
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="password"
                        value={activeRequest.auth.token || ''}
                        onChange={(e) =>
                          updateActiveRequest({
                            auth: {
                              ...activeRequest.auth,
                              token: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#4f8ef7] focus:ring-2 focus:ring-[#4f8ef7]/20 dark:border-gray-700 dark:bg-[#0d0f14] transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
