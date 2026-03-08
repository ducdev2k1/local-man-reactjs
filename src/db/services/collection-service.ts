import { v4 as uuidv4 } from 'uuid';
import type { ICollection } from '../../Types/models';
import { db } from '../database';

export const collectionService = {
  async getAll(): Promise<ICollection[]> {
    return db.collections.orderBy('sort_order').toArray();
  },

  async getById(id: string): Promise<ICollection | undefined> {
    return db.collections.get(id);
  },

  async create(
    collection: Omit<ICollection, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.collections.add({
      ...collection,
      id,
      created_at: now,
      updated_at: now,
    });

    return id;
  },

  async update(
    id: string,
    updates: Partial<Omit<ICollection, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<number> {
    const now = new Date().toISOString();
    return db.collections.update(id, {
      ...updates,
      updated_at: now,
    });
  },

  async delete(id: string): Promise<void> {
    // Phase 2 plan: Collection service cascade deletes folders and requests
    await db.transaction(
      'rw',
      db.collections,
      db.folders,
      db.requests,
      async () => {
        // 1. Delete requests
        await db.requests.where('collection_id').equals(id).delete();
        // 2. Delete folders
        await db.folders.where('collection_id').equals(id).delete();
        // 3. Delete the collection itself
        await db.collections.delete(id);
      },
    );
  },
};
