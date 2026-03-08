import { Database, Layout } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-gray-200/50 u-glass px-3 text-[11px] text-gray-500 dark:text-gray-400 z-10 !bg-white/5 dark:!bg-black/10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors">
          <Database size={12} className="text-green-500" />
          <span>{t('footer.dbConnected')}</span>
        </div>
        <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-700"></div>
        <div className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors">
          <Layout size={12} />
          <span>{t('footer.workspace')}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>{t('footer.offlineReady')}</span>
        </div>
        <span>{t('footer.version')}</span>
      </div>
    </footer>
  );
};
