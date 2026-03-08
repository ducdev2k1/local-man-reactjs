/**
 * Component Name: Sidebar
 * Description: Main Sidebar Container using children components for modularity (<400 lines)
 * SCSS File: src/assets/scss/components/_c-sidebar.scss
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { Clock, Folder, Globe, Plus, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../db/database';
import { collectionService } from '../../db/services/collection-service';
import { requestService } from '../../db/services/request-service';
import { useRequestStore } from '../../stores/request-store';
import type { IHistoryItem } from '../../Types';
import { AddCollectionModal } from '../common/AddCollectionModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Sub-components
import { SidebarCollections } from './SidebarCollections';
import { SidebarHistory } from './SidebarHistory';
import { SidebarNav } from './SidebarNav';

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
  const { t } = useTranslation();
  const openRequest = useRequestStore((state) => state.openRequest);
  const removeRequestFromStore = useRequestStore(
    (state) => state.removeRequest,
  );
  const updateTabInfo = useRequestStore((state) => state.updateTabInfo);

  // State: UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // DB Queries
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

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const q = searchQuery.toLowerCase();
    return (collections || []).filter(
      (col) =>
        col.name.toLowerCase().includes(q) ||
        requests
          ?.filter((r) => r.collection_id === col.id)
          .some((r) => r.name.toLowerCase().includes(q)),
    );
  }, [collections, requests, searchQuery]);

  // Actions
  const handleToggleCollection = async (
    e: React.MouseEvent,
    id: string,
    isOpen: boolean,
  ) => {
    e.stopPropagation();
    await collectionService.update(id, { isOpen: !isOpen });
  };

  const handleAddRequest = async (collectionId: string) => {
    const id = await requestService.create({
      collection_id: collectionId,
      name: 'New Request',
    });
    const newReq = await requestService.getById(id);
    if (newReq) openRequest(newReq);
  };

  const handleDeleteCollection = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: t('sidebar.deleteCollection'),
      message: t('common.confirmDeleteCollection'),
      onConfirm: async () => {
        requests
          ?.filter((r) => r.collection_id === id)
          .forEach((r) => removeRequestFromStore(r.id));
        await collectionService.delete(id);
      },
    });
  };

  const handleDeleteRequest = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: t('sidebar.deleteRequest'),
      message: t('common.confirmDeleteRequest'),
      onConfirm: async () => {
        removeRequestFromStore(id);
        await requestService.delete(id);
      },
    });
  };

  const navTabs = [
    { id: 'collections', icon: Folder, tooltip: t('sidebar.collections') },
    { id: 'environments', icon: Globe, tooltip: t('sidebar.environments') },
    { id: 'history', icon: Clock, tooltip: t('sidebar.history') },
  ];

  return (
    <>
      <SidebarNav
        tabs={navTabs}
        activeTab={activeSidebarTab}
        setActiveTab={setActiveSidebarTab}
      />

      <aside
        style={{ width: sidebarWidth }}
        className="c-sidebar u-glass-sidebar border-none"
      >
        {activeSidebarTab === 'collections' && (
          <>
            <div className="flex items-center justify-between p-3 shrink-0">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[10px] uppercase tracking-widest opacity-70">
                {t('sidebar.collections')}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(true)}
                  className="h-6 w-6"
                >
                  <Plus size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(!showSearch)}
                  className={`h-6 w-6 ${showSearch ? 'text-[#4f8ef7]' : ''}`}
                >
                  <Search size={14} />
                </Button>
              </div>
            </div>

            {showSearch && (
              <div className="px-3 pb-2 shrink-0">
                <div className="relative flex items-center">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('sidebar.searchPlaceholder')}
                    className="pl-8 h-8 text-xs u-glass !bg-white/5 border-none"
                    autoFocus
                  />
                  <Search
                    size={12}
                    className="absolute left-2.5 text-gray-400"
                  />
                </div>
              </div>
            )}

            <SidebarCollections
              collections={filteredCollections || []}
              requests={requests || []}
              renamingId={renamingId}
              renameValue={renameValue}
              setRenamingId={setRenamingId}
              setRenameValue={setRenameValue}
              onToggleCollection={handleToggleCollection}
              onAddRequest={handleAddRequest}
              onRenameCollection={(col) => {
                setRenamingId(col.id);
                setRenameValue(col.name);
              }}
              onDeleteCollection={handleDeleteCollection}
              onRenameRequest={(req) => {
                setRenamingId(req.id);
                setRenameValue(req.name);
              }}
              onDuplicateRequest={async (id) => {
                const nId = await requestService.duplicate(id);
                const nR = nId ? await requestService.getById(nId) : null;
                if (nR) openRequest(nR);
              }}
              onDeleteRequest={handleDeleteRequest}
              onOpenRequest={openRequest}
              submitRenameCollection={async (id) => {
                if (renameValue.trim())
                  await collectionService.update(id, { name: renameValue });
                setRenamingId(null);
              }}
              submitRenameRequest={async (id) => {
                if (renameValue.trim()) {
                  await requestService.update(id, { name: renameValue });
                  updateTabInfo(id, { name: renameValue });
                }
                setRenamingId(null);
              }}
            />
          </>
        )}

        {activeSidebarTab === 'history' && (
          <SidebarHistory history={mockHistory} />
        )}
      </aside>

      <AddCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(n) =>
          collectionService.create({
            name: n,
            sort_order: collections?.length || 0,
            isOpen: true,
          })
        }
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() => setConfirmModal((p) => ({ ...p, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
      />
    </>
  );
};
