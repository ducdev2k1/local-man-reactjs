import { CheckCircle2, Edit2, Globe, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { environmentService } from '../../db/services/environment-service';
import type { IEnvironment } from '../../Types/models';
import { Button } from '../ui/button';

interface IProps {
  environments: IEnvironment[];
  onAddEnvironment: () => void;
  onEditEnvironment: (env: IEnvironment) => void;
  onDeleteEnvironment: (env: IEnvironment) => void;
}

export const SidebarEnvironments: React.FC<IProps> = ({
  environments,
  onAddEnvironment,
  onEditEnvironment,
  onDeleteEnvironment,
}) => {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleToggleActive = async (env: IEnvironment) => {
    if (env.is_active) {
       await environmentService.update(env.id, { is_active: false });
    } else {
       await environmentService.setActive(env.id);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 shrink-0 border-b border-gray-200/50 dark:border-gray-800/50">
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
          {t('sidebar.environments')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddEnvironment}
          className="h-6 w-6"
          title={t('environments.add')}
        >
          <Plus size={14} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {environments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Globe className="mb-2 opacity-50" size={32} />
            <span className="text-xs">{t('environments.empty')}</span>
          </div>
        ) : (
          environments.map((env) => (
            <div
              key={env.id}
              className={`flex items-center justify-between p-2 mx-2 mt-1 cursor-pointer transition-colors rounded-md ${
                env.is_active
                  ? 'bg-[#4f8ef7]/10 text-[#4f8ef7]'
                  : 'hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-700 dark:text-gray-300'
              }`}
              onMouseEnter={() => setHoveredId(env.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleToggleActive(env)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle2
                  size={14}
                  className={`shrink-0 ${
                    env.is_active ? 'opacity-100 text-[#4f8ef7]' : 'opacity-0'
                  }`}
                />
                <span className="text-xs font-medium truncate group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {env.name}
                </span>
              </div>
              
              <div
                className={`flex items-center gap-1 shrink-0 ${
                  hoveredId === env.id ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-200`}
                onClick={(e) => e.stopPropagation()} // Prevent toggling active when clicking actions
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  onClick={() => onEditEnvironment(env)}
                  title={t('environments.edit')}
                >
                  <Edit2 size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  onClick={() => onDeleteEnvironment(env)}
                  title={t('common.delete')}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
