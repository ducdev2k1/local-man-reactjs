/**
 * Component Name: Sidebar
 * Description: Thanh điều hướng bên trái gồm Collections, Environments, History
 * SCSS File: src/assets/scss/components/_c-add-collection-modal.scss
 */

import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  Folder,
  Globe,
  MoreVertical,
  Plus,
  Search,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { db } from '../../db/database';
import { collectionService } from '../../db/services/collection-service';
import { useRequestStore } from '../../stores/request-store';
import type { IHistoryItem } from '../../Types';
import { AddCollectionModal } from '../common/AddCollectionModal';
import { MethodBadge } from '../common/MethodBadge';
import { MethodText } from '../common/MethodText';

interface IProps {
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;
  mockHistory: IHistoryItem[];
  sidebarWidth: number;
}

export const Sidebar: React.FC<IProps> = ({
  activeSidebarTab,
  setActiveSidebarTab,
  mockHistory,
  sidebarWidth,
}) => {
  const openRequest = useRequestStore((state) => state.openRequest);

  // State: Modal & Search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Reactive DB Queries
  const collections = useLiveQuery(
    () => db.collections.orderBy('sort_order').toArray(),
    [],
    [],
  );
  const requests = useLiveQuery(
    () => db.requests.orderBy('sort_order').toArray(),
    [],
    [],
  );

  // Computed: Lọc collections theo search query
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const query = searchQuery.toLowerCase();
    return collections.filter((col) => {
      if (col.name.toLowerCase().includes(query)) return true;
      const colRequests =
        requests?.filter((r) => r.collection_id === col.id) || [];
      return colRequests.some(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.url.toLowerCase().includes(query),
      );
    });
  }, [collections, requests, searchQuery]);

  // Methods
  const handleToggleCollection = async (
    e: React.MouseEvent,
    id: string,
    isOpen: boolean,
  ) => {
    e.stopPropagation();
    await collectionService.update(id, { isOpen: !isOpen });
  };

  const handleAddCollection = async (name: string, description?: string) => {
    await collectionService.create({
      name,
      description: description || '',
      sort_order: collections ? collections.length + 1 : 1,
      isOpen: true,
    });
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchQuery('');
  };

  const sidebarTabs = [
    { id: 'collections', icon: Folder, tooltip: 'Collections' },
    { id: 'environments', icon: Globe, tooltip: 'Environments' },
    { id: 'history', icon: Clock, tooltip: 'History' },
  ];

  return (
    <>
      <nav className="flex w-12 flex-col items-center border-r border-gray-200 bg-gray-50 py-3 dark:border-gray-800 dark:bg-[#0d0f14]">
        <div className="flex flex-col gap-2 w-full px-2">
          {sidebarTabs.map((item) => {
            const isActive = activeSidebarTab === item.id;
            const activeClass =
              'bg-blue-50 text-[#4f8ef7] dark:bg-blue-500/10 dark:text-[#4f8ef7]';
            const inactiveClass =
              'text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-gray-200';

            return (
              <button
                key={item.id}
                onClick={() => setActiveSidebarTab(item.id)}
                className={`relative flex h-8 w-full items-center justify-center rounded-lg transition-all duration-200 group ${isActive ? activeClass : inactiveClass}`}
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

      <aside
        style={{ width: sidebarWidth }}
        className="flex flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-[#12151c]"
      >
        {activeSidebarTab === 'collections' && (
          <>
            <div className="flex items-center justify-between p-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
                Collections
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-white transition-colors"
                  title="Add Collection"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={handleToggleSearch}
                  className={`p-1.5 rounded-md transition-colors ${showSearch ? 'text-[#4f8ef7] bg-[#4f8ef7]/10' : 'text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#181c25] dark:hover:text-white'}`}
                  title="Search Collections"
                >
                  <Search size={14} />
                </button>
              </div>
            </div>

            {showSearch && (
              <div className="c-sidebar-search_wrapper">
                <div className="c-sidebar-search_input-group">
                  <Search size={13} className="c-sidebar-search_icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search collections..."
                    className="c-sidebar-search_input"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="c-sidebar-search_clear"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {filteredCollections?.map((col) => {
                const colRequests =
                  requests?.filter((r) => r.collection_id === col.id) || [];

                return (
                  <div key={col.id} className="mb-0.5 select-none">
                    <div
                      onClick={(e) =>
                        handleToggleCollection(e, col.id, col.isOpen)
                      }
                      className="flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 px-2 hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-800 dark:text-gray-200 transition-colors"
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
                      <span className="truncate text-xs font-medium">
                        {col.name}
                      </span>
                    </div>

                    {col.isOpen && (
                      <div className="ml-5 mt-0.5 mb-1.5 space-y-0.5 border-l border-gray-200 dark:border-gray-800">
                        {colRequests.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => openRequest(item)}
                            className="group flex cursor-pointer items-center justify-between rounded-md py-1.5 pl-3 pr-2 transition-colors hover:bg-gray-200/50 dark:hover:bg-[#1e2330] text-gray-700 dark:text-gray-300"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <MethodBadge method={item.method} />
                              <span className="truncate text-[12px] dark:group-hover:text-gray-100">
                                {item.name}
                              </span>
                            </div>
                            <MoreVertical
                              size={14}
                              className="opacity-0 text-gray-400 dark:text-gray-500 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {searchQuery && filteredCollections?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                  <Search size={24} className="mb-2 opacity-30" />
                  <span className="text-xs">No results found</span>
                </div>
              )}
            </div>
          </>
        )}

        {activeSidebarTab === 'history' && (
          <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-800">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
                History
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockHistory.map((h) => {
                const isSuccess = h.status === 200 || h.status === 201;
                const statusClass = isSuccess
                  ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';

                return (
                  <div
                    key={h.id}
                    className="p-3 border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-[#1e2330] cursor-pointer group transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <MethodText method={h.method} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate max-w-[120px] transition-colors">
                          {h.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${statusClass}`}
                      >
                        {h.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500">
                      <span>{h.time}</span>
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
        )}
      </aside>

      <AddCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCollection}
      />
    </>
  );
};
