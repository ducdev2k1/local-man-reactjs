import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface ISidebarTab {
  id: string;
  icon: LucideIcon;
  tooltip: string;
}

interface IProps {
  tabs: ISidebarTab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const SidebarNav: React.FC<IProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="c-sidebar_nav u-glass-sidebar">
      <div className="flex flex-col gap-2 w-full px-2">
        {tabs.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group c-sidebar_tab-btn ${isActive ? 'c-sidebar_tab-btn-active' : 'c-sidebar_tab-btn-inactive'}`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <div className="absolute left-full ml-2 hidden rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-sm group-hover:block dark:bg-white dark:text-gray-900 z-50 whitespace-nowrap">
                {item.tooltip}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
