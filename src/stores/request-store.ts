import { create } from 'zustand';
import type { IApiRequest } from '../Types/models';
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
  closeTab: (id: string) => void;
  updateActiveRequest: (partial: Partial<IApiRequest>) => void;
  saveRequest: () => Promise<void>;
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  openTabs: [],
  activeTabId: null,
  activeRequest: null,
  isDirty: false,

  openRequest: async (request: IApiRequest) => {
    const { openTabs } = get();
    // Check if implicitly open
    const exists = openTabs.find((t) => t.id === request.id);
    if (!exists) {
      set({
        openTabs: [
          ...openTabs,
          { id: request.id, name: request.name, method: request.method },
        ],
      });
    }

    // Set as active
    set({
      activeTabId: request.id,
      activeRequest: request, // Simple clone or use immutable state in actual complex scenarios
      isDirty: false,
    });
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

    // We would need to load the new nextActiveId request here in a real scenario
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
}));
