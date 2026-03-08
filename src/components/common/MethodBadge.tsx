import React from 'react';
import type { TypeHttpMethod } from '../../Types';

interface IProps {
  method: TypeHttpMethod | string; // Assuming string fallback for dynamic methods
}

export const MethodBadge: React.FC<IProps> = ({ method }) => {
  const colors: Record<string, string> = {
    GET: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20',
    POST: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20',
    PUT: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20',
    DELETE: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20',
    PATCH:
      'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20',
  };
  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${colors[method as string] || 'text-gray-500'}`}
    >
      {method}
    </span>
  );
};
