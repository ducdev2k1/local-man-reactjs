import { ArrowRightLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { IHistoryEntry, TypeHttpMethod } from '../../Types/models';
import { MethodText } from '../common/MethodText';

interface IProps {
  history: IHistoryEntry[];
}

export const SidebarHistory: React.FC<IProps> = ({ history }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="p-3 border-b border-gray-200/50 dark:border-gray-800/50">
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
          {t('sidebar.history')}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.map((h) => {
          const isSuccess = h.status_code >= 200 && h.status_code < 300;
          const statusClass = isSuccess
            ? 'bg-green-100/80 text-green-700 dark:bg-green-500/20 dark:text-green-400'
            : 'bg-red-100/80 text-red-700 dark:bg-red-500/20 dark:text-red-400';

          return (
            <div
              key={h.id}
              className="p-3 mb-1 mx-2 cursor-pointer group transition-colors rounded-md hover:bg-gray-200/50 dark:hover:bg-[#1e2330]"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <MethodText method={h.method as TypeHttpMethod} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate max-w-[120px] transition-colors" title={h.url}>
                    {h.request_snapshot?.name || h.url || 'Unknown Request'}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${statusClass}`}
                >
                  {h.status_code}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500">
                <span>{new Date(h.timestamp).toLocaleString()}</span>
                <ArrowRightLeft
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
