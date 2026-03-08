import {
  Cloud,
  Languages,
  Monitor,
  Moon,
  Settings,
  Sun,
  Zap,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

export const Header: React.FC<IProps> = ({ themeMode, setThemeMode }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex relative h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-[#0d0f14] z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4f8ef7] to-[#82b4ff] shadow-sm shadow-blue-500/20">
          <Zap size={14} className="text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white tracking-tight">
          Localman
        </span>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-0.5 rounded-lg bg-gray-100/80 dark:bg-[#181c25] border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <button className="rounded-md bg-white px-4 py-1.5 text-xs font-semibold shadow-sm dark:bg-[#232834] dark:text-white transition-all">
          {t('header.requests')}
        </button>
        <button className="rounded-md px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-all">
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
          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#181c25] transition-colors">
              <Languages size={15} />
              <span className="text-[11px] font-medium uppercase truncate max-w-[40px]">
                {i18n.language}
              </span>
            </button>
            <div className="absolute right-0 top-full z-20 hidden mt-1 w-32 rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur p-1.5 shadow-xl group-hover:block dark:border-gray-800 dark:bg-[#181c25]/95">
              <button
                onClick={() => changeLanguage('vi')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${i18n.language === 'vi' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Tiếng Việt
                {i18n.language === 'vi' && (
                  <div className="h-1 w-1 rounded-full bg-[#4f8ef7]"></div>
                )}
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${i18n.language === 'en' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}
              >
                English
                {i18n.language === 'en' && (
                  <div className="h-1 w-1 rounded-full bg-[#4f8ef7]"></div>
                )}
              </button>
            </div>
          </div>

          <div className="relative group">
            <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-[#181c25] text-gray-500 dark:text-gray-400 transition-colors">
              {themeMode === 'light' ? (
                <Sun size={15} />
              ) : themeMode === 'dark' ? (
                <Moon size={15} />
              ) : (
                <Monitor size={15} />
              )}
            </button>
            <div className="absolute right-0 top-full z-20 hidden mt-1 w-36 rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur p-1.5 shadow-xl group-hover:block dark:border-gray-800 dark:bg-[#181c25]/95">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${themeMode === 'light' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <Sun size={14} /> {t('header.themeLight')}
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${themeMode === 'dark' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <Moon size={14} /> {t('header.themeDark')}
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800/50 ${themeMode === 'system' ? 'text-[#4f8ef7] font-medium' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <Monitor size={14} /> {t('header.themeSystem')}
              </button>
            </div>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 dark:text-gray-400 dark:hover:bg-[#181c25] transition-colors">
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
