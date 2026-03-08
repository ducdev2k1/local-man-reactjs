import { Cloud, Zap } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderSettings } from './HeaderSettings';

interface IProps {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

export const Header: React.FC<IProps> = ({ themeMode, setThemeMode }) => {
  const { t } = useTranslation();

  return (
    <header className="flex relative h-12 shrink-0 items-center justify-between px-4 u-glass-sidebar border-b border-white/5 z-10 transition-all">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4f8ef7] to-[#82b4ff] shadow-sm shadow-blue-500/20">
          <Zap size={14} className="text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white tracking-tight">
          Localman
        </span>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-0.5 rounded-xl u-glass shadow-sm !border-white/20 !bg-white/10">
        <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold shadow-sm dark:bg-[#232834] dark:text-white transition-all">
          {t('header.requests')}
        </button>
        <button className="rounded-lg px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-all">
          {t('header.runner')}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full border border-green-200/50 bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-600 dark:border-green-900/30 dark:bg-green-500/10 dark:text-green-400">
          <Cloud size={12} />
          <span>{t('header.synced')}</span>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800"></div>

        <div className="flex items-center gap-1 text-gray-500">
          <HeaderSettings themeMode={themeMode} setThemeMode={setThemeMode} />
        </div>
      </div>
    </header>
  );
};
