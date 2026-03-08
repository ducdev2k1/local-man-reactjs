/**
 * Component Name: HeaderSettings
 * Description: Component hiển thị menu cài đặt ngôn ngữ và giao diện
 * SCSS File: src/assets/scss/components/_c-header-settings.scss
 */

import { Languages, Monitor, Moon, Settings, Sun } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface IProps {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

export const HeaderSettings: React.FC<IProps> = ({
  themeMode,
  setThemeMode,
}) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="c-header-settings_trigger">
          <Settings size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Languages size={14} />
            <span>{t('header.language')}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-32">
              <DropdownMenuItem
                onClick={() => changeLanguage('vi')}
                className={`flex items-center justify-between ${i18n.language === 'vi' ? 'text-[#4f8ef7] font-medium' : ''}`}
              >
                Tiếng Việt
                {i18n.language === 'vi' && (
                  <div className="h-1 w-1 rounded-full bg-[#4f8ef7]"></div>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLanguage('en')}
                className={`flex items-center justify-between ${i18n.language === 'en' ? 'text-[#4f8ef7] font-medium' : ''}`}
              >
                English
                {i18n.language === 'en' && (
                  <div className="h-1 w-1 rounded-full bg-[#4f8ef7]"></div>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            {themeMode === 'light' ? (
              <Sun size={14} />
            ) : themeMode === 'dark' ? (
              <Moon size={14} />
            ) : (
              <Monitor size={14} />
            )}
            <span>{t('header.theme')}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-36">
              <DropdownMenuItem
                onClick={() => setThemeMode('light')}
                className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#4f8ef7] font-medium' : ''}`}
              >
                <Sun size={14} /> {t('header.themeLight')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThemeMode('dark')}
                className={`flex items-center gap-2 ${themeMode === 'dark' ? 'text-[#4f8ef7] font-medium' : ''}`}
              >
                <Moon size={14} /> {t('header.themeDark')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThemeMode('system')}
                className={`flex items-center gap-2 ${themeMode === 'system' ? 'text-[#4f8ef7] font-medium' : ''}`}
              >
                <Monitor size={14} /> {t('header.themeSystem')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
