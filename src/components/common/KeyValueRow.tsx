import { Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  isNew?: boolean;
  defaultKey?: string;
  defaultVal?: string;
  defaultDesc?: string;
}

export const KeyValueRow: React.FC<IProps> = ({
  isNew,
  defaultKey = '',
  defaultVal = '',
  defaultDesc = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex group items-center border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-[#181c25]/50 transition-colors">
      <div className="w-8 flex justify-center py-2">
        {!isNew && (
          <input
            type="checkbox"
            defaultChecked
            className="accent-[#4f8ef7] rounded-sm w-3 h-3 border-gray-300 dark:border-gray-600 bg-transparent"
          />
        )}
      </div>
      <div className="w-1/3 border-r border-gray-100 dark:border-gray-800/60">
        <input
          type="text"
          placeholder={isNew ? t('common.newKey') : t('common.key')}
          defaultValue={defaultKey}
          className={`w-full bg-transparent px-3 py-1.5 outline-none font-mono text-xs focus:bg-white dark:focus:bg-[#12151c] ${isNew ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}
        />
      </div>
      <div className="w-1/3 border-r border-gray-100 dark:border-gray-800/60">
        <input
          type="text"
          placeholder={t('common.value')}
          defaultValue={defaultVal}
          className={`w-full bg-transparent px-3 py-1.5 outline-none font-mono text-xs focus:bg-white dark:focus:bg-[#12151c] ${isNew ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}
        />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <input
          type="text"
          placeholder={t('common.description')}
          defaultValue={defaultDesc}
          className="w-full bg-transparent px-3 py-1.5 outline-none text-xs text-gray-500 focus:bg-white dark:focus:bg-[#12151c]"
        />
        {!isNew && (
          <button className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-all">
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
