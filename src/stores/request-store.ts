import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IApiRequest } from '../Types/models';
import { db } from '../db/database';
import { requestService } from '../db/services/request-service';

interface TabInfo {
  id: string; // The request ID
  name: string;
  method: string;
}

interface RequestStore {
  // Tabs
  openTabs: TabInfo[];
  activeTabId: string | null;

  // Active Request State
  activeRequest: IApiRequest | null;
  isDirty: boolean;

  // Actions
  openRequest: (request: IApiRequest) => Promise<void>;
  switchTab: (id: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  createNewRequest: (collectionId?: string) => Promise<void>;
  closeTab: (id: string) => void;
  updateActiveRequest: (partial: Partial<IApiRequest>) => void;
  saveRequest: () => Promise<void>;
  removeRequest: (id: string) => void;
  updateTabInfo: (id: string, partial: Partial<TabInfo>) => void;
  closeOthers: (id: string) => void;
  closeToTheRight: (id: string) => void;
  duplicateTab: (id: string) => Promise<void>;
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      openTabs: [],
      activeTabId: null,
      activeRequest: null,
      isDirty: false,

      openRequest: async (request: IApiRequest) => {
        const { openTabs } = get();
        const exists = openTabs.find((t) => t.id === request.id);
        if (!exists) {
          set({
            openTabs: [
              ...openTabs,
              { id: request.id, name: request.name, method: request.method },
            ],
          });
        }

        set({
          activeTabId: request.id,
          activeRequest: request,
          isDirty: false,
        });
      },

      switchTab: async (id: string) => {
        const { activeTabId } = get();
        if (activeTabId === id) return; // Already active
        
        const request = await requestService.getById(id);
        if (request) {
          set({
            activeTabId: request.id,
            activeRequest: request,
            isDirty: false,
          });
        }
      },

      restoreSession: async () => {
        const { activeTabId } = get();
        if (activeTabId) {
          const request = await requestService.getById(activeTabId);
          if (request) {
            set({
              activeRequest: request,
              isDirty: false,
            });
          }
        }
      },

      createNewRequest: async (collectionId?: string) => {
        // Lấy collection đầu tiên nếu không truyền collectionId
        let targetCollectionId = collectionId;
        if (!targetCollectionId) {
          const firstCollection = await db.collections
            .orderBy('sort_order')
            .first();
          targetCollectionId = firstCollection?.id || '';
        }

        // Tạo request mới trong DB
        const newId = await requestService.create({
          collection_id: targetCollectionId,
          name: 'New Request',
          url: '',
        });

        // Lấy request vừa tạo từ DB
        const newRequest = await requestService.getById(newId);
        if (newRequest) {
          // Mở tab mới
          const { openTabs } = get();
          set({
            openTabs: [
              ...openTabs,
              {
                id: newRequest.id,
                name: newRequest.name,
                method: newRequest.method,
              },
            ],
            activeTabId: newRequest.id,
            activeRequest: newRequest,
            isDirty: false,
          });
        }
      },

      closeTab: (id: string) => {
        const { openTabs, activeTabId } = get();
        const newTabs = openTabs.filter((t) => t.id !== id);

        let nextActiveId = activeTabId;
        if (activeTabId === id) {
          // Activate another tab if any
          nextActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }

        set({ openTabs: newTabs, activeTabId: nextActiveId });

        // We load the new nextActiveId request here
        if (nextActiveId) {
          get().switchTab(nextActiveId);
        } else {
           set({ activeRequest: null, isDirty: false });
        }
      },

      updateActiveRequest: (partial: Partial<IApiRequest>) => {
        const { activeRequest } = get();
        if (activeRequest) {
          set({
            activeRequest: { ...activeRequest, ...partial },
            isDirty: true,
          });
          // A debounced save could be triggered here
        }
      },

      saveRequest: async () => {
        const { activeRequest, isDirty } = get();
        if (activeRequest && isDirty) {
          await requestService.update(activeRequest.id, activeRequest);

          // Update the name in the tab if it changed
          const { openTabs } = get();
          const newTabs = openTabs.map((t) =>
            t.id === activeRequest.id
              ? { ...t, name: activeRequest.name, method: activeRequest.method }
              : t,
          );

          set({
            isDirty: false,
            openTabs: newTabs,
          });
        }
      },

      removeRequest: (id: string) => {
        const { openTabs, activeTabId } = get();
        const newTabs = openTabs.filter((t) => t.id !== id);
        let nextActiveId = activeTabId;
        let nextActiveRequest = get().activeRequest;

        if (activeTabId === id) {
          nextActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
          nextActiveRequest = null;
        }

        set({
          openTabs: newTabs,
          activeTabId: nextActiveId,
          activeRequest: nextActiveRequest,
        });

        if (nextActiveId && activeTabId === id) {
           get().switchTab(nextActiveId);
        }
      },

      updateTabInfo: (id: string, partial: Partial<TabInfo>) => {
        const { openTabs } = get();
        const newTabs = openTabs.map((t) =>
          t.id === id ? { ...t, ...partial } : t,
        );
        set({ openTabs: newTabs });
      },

      closeOthers: (id: string) => {
        const { openTabs } = get();
        const newTabs = openTabs.filter((t) => t.id === id);
        set({ openTabs: newTabs, activeTabId: id });
        get().switchTab(id);
      },

      closeToTheRight: (id: string) => {
        const { openTabs, activeTabId } = get();
        const index = openTabs.findIndex((t) => t.id === id);
        if (index === -1) return;

        const newTabs = openTabs.slice(0, index + 1);
        let nextActiveId = activeTabId;

        // If active tab was to the right, switch to the 'id' tab
        const activeIndex = openTabs.findIndex((t) => t.id === activeTabId);
        if (activeIndex > index) {
          nextActiveId = id;
        }

        set({ openTabs: newTabs, activeTabId: nextActiveId });
        if (nextActiveId) {
          get().switchTab(nextActiveId);
        }
      },

      duplicateTab: async (id: string) => {
        const newId = await requestService.duplicate(id);
        if (newId) {
          const newReq = await requestService.getById(newId);
          if (newReq) {
            const { openRequest } = get();
            await openRequest(newReq);
          }
        }
      },
    }),
    {
      name: 'request-store', // key in localStorage
      partialize: (state) => ({ 
        openTabs: state.openTabs, 
        activeTabId: state.activeTabId 
      }), // Only persist tabs state, NOT the heavy activeRequest object
    }
  )
);
