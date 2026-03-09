import type { IHistoryEntry } from '../../Types/models';
import { db } from '../database';

export const historyService = {
  async getAll(): Promise<IHistoryEntry[]> {
    return db.history.orderBy('timestamp').reverse().toArray();
  },

  async add(entry: Omit<IHistoryEntry, 'id'>): Promise<number> {
    return db.history.add({
      ...entry,
    } as IHistoryEntry);
  },

  async clearAll(): Promise<void> {
    await db.history.clear();
  },

  async delete(id: number): Promise<void> {
    await db.history.delete(id);
  },
};
