import {
  ChevronDown,
  ChevronRight,
  Copy,
  Edit2,
  Folder,
  FolderPlus,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRequestStore } from '../../stores/request-store';
import type { IApiRequest, ICollection } from '../../Types/models';
import { MethodBadge } from '../common/MethodBadge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';

interface IProps {
  collections: ICollection[];
  requests: IApiRequest[];
  renamingId: string | null;
  renameValue: string;
  setRenamingId: (id: string | null) => void;
  setRenameValue: (val: string) => void;
  onToggleCollection: (
    e: React.MouseEvent,
    id: string,
    isOpen: boolean,
  ) => void;
  onAddRequest: (collectionId: string) => void;
  onRenameCollection: (col: ICollection) => void;
  onDeleteCollection: (id: string) => void;
  onRenameRequest: (req: IApiRequest) => void;
  onDuplicateRequest: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onOpenRequest: (req: IApiRequest) => void;
  submitRenameCollection: (id: string) => void;
  submitRenameRequest: (id: string) => void;
}

export const SidebarCollections: React.FC<IProps> = ({
  collections,
  requests,
  renamingId,
  renameValue,
  setRenamingId,
  setRenameValue,
  onToggleCollection,
  onAddRequest,
  onRenameCollection,
  onDeleteCollection,
  onRenameRequest,
  onDuplicateRequest,
  onDeleteRequest,
  onOpenRequest,
  submitRenameCollection,
  submitRenameRequest,
}) => {
  const { t } = useTranslation();
  const activeTabId = useRequestStore((state) => state.activeTabId);

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-4">
      {collections?.map((col) => {
        const colRequests =
          requests?.filter((r) => r.collection_id === col.id) || [];

        return (
          <div key={col.id} className="mb-0.5 select-none">
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  onClick={(e) =>
                    onToggleCollection(e, col.id, col.isOpen || false)
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-[#1e2330]/50 py-2 px-3 hover:bg-gray-100 dark:hover:bg-[#1e2330] transition-colors mb-2 shadow-sm"
                >
                  {col.isOpen ? (
                    <ChevronDown
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  ) : (
                    <ChevronRight
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  )}
                  <Folder
                    size={14}
                    className="text-[#4f8ef7] fill-[#4f8ef7]/20 dark:fill-[#4f8ef7]/30"
                  />
                  {renamingId === col.id ? (
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => submitRenameCollection(col.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitRenameCollection(col.id);
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      className="h-6 py-0 px-1 text-xs focus-visible:ring-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {col.name}
                    </span>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem
                  className="gap-2"
                  onClick={() => onAddRequest(col.id)}
                >
                  <Plus size={14} /> {t('common.addRequest')}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="gap-2">
                  <FolderPlus size={14} /> {t('common.addFolder')}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  className="gap-2"
                  onClick={() => onRenameCollection(col)}
                >
                  <Edit2 size={14} /> {t('common.rename')}
                </ContextMenuItem>
                <ContextMenuItem
                  className="gap-2 text-red-500 focus:text-red-500"
                  onClick={() => onDeleteCollection(col.id)}
                >
                  <Trash2 size={14} /> {t('common.delete')}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            {col.isOpen && (
              <div className="ml-4 mt-1 mb-3">
                {colRequests.map((item) => (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <div
                        onClick={() => onOpenRequest(item)}
                        className={`group flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800/80 bg-white dark:bg-[#131720] py-1.5 pl-3 pr-2 transition-colors mb-1.5 hover:bg-gray-50 dark:hover:bg-[#1e2330] shadow-sm ${
                          activeTabId === item.id
                            ? 'border-[#4f8ef7]/50 dark:border-[#4f8ef7]/50 bg-blue-50/50 dark:bg-[#1a2332] text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden w-full">
                          <MethodBadge method={item.method} />
                          {renamingId === item.id ? (
                            <Input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={() => submitRenameRequest(item.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                  submitRenameRequest(item.id);
                                if (e.key === 'Escape') setRenamingId(null);
                              }}
                              className="h-6 py-0 px-1 text-xs focus-visible:ring-1"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="truncate text-[12px] dark:group-hover:text-gray-100">
                              {item.name}
                            </span>
                          )}
                        </div>
                        {!renamingId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div
                                role="button"
                                className="opacity-0 text-gray-400 dark:text-gray-500 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical size={14} />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRenameRequest(item);
                                }}
                              >
                                <Edit2 size={14} /> {t('common.rename')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDuplicateRequest(item.id);
                                }}
                              >
                                <Copy size={14} /> {t('common.duplicate')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteRequest(item.id);
                                }}
                              >
                                <Trash2 size={14} />{' '}
                                {t('sidebar.deleteRequest')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem
                        className="gap-2"
                        onClick={() => onRenameRequest(item)}
                      >
                        <Edit2 size={14} /> {t('common.rename')}
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="gap-2"
                        onClick={() => onDuplicateRequest(item.id)}
                      >
                        <Copy size={14} /> {t('common.duplicate')}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        className="gap-2 text-red-500 focus:text-red-500"
                        onClick={() => onDeleteRequest(item.id)}
                      >
                        <Trash2 size={14} /> {t('sidebar.deleteRequest')}
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
