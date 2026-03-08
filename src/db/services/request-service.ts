import { v4 as uuidv4 } from 'uuid';
import type {
  IApiRequest,
  TypeAuthType,
  TypeBodyType,
  TypeHttpMethod,
} from '../../Types/models';
import { db } from '../database';

// Default new request
const createDefaultRequest = (
  collectionId: string,
  folderId: string | null = null,
): Omit<IApiRequest, 'id' | 'created_at' | 'updated_at'> => ({
  collection_id: collectionId,
  folder_id: folderId,
  name: 'New Request',
  method: 'GET' as TypeHttpMethod,
  url: '',
  params: [],
  headers: [],
  body: {
    type: 'none' as TypeBodyType,
    content: '',
  },
  auth: {
    type: 'No Auth' as TypeAuthType,
  },
  sort_order: Date.now(),
});

export const requestService = {
  async getAllByCollection(collectionId: string): Promise<IApiRequest[]> {
    return db.requests.where('collection_id').equals(collectionId).toArray();
  },

  async getAll(): Promise<IApiRequest[]> {
    return db.requests.toArray();
  },

  async getById(id: string): Promise<IApiRequest | undefined> {
    return db.requests.get(id);
  },

  async create(
    requestInput?: Partial<
      Omit<IApiRequest, 'id' | 'created_at' | 'updated_at'>
    > & { collection_id: string },
  ): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Ensure we have a collection_id, otherwise we shouldn't be creating it ideally, but let's enforce it here
    const collectionId = requestInput?.collection_id || '';

    const defaultReq = createDefaultRequest(collectionId);

    await db.requests.add({
      ...defaultReq,
      ...requestInput,
      id,
      created_at: now,
      updated_at: now,
    });

    return id;
  },

  async update(
    id: string,
    updates: Partial<Omit<IApiRequest, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<number> {
    const now = new Date().toISOString();
    return db.requests.update(id, {
      ...updates,
      updated_at: now,
    });
  },

  async delete(id: string): Promise<void> {
    await db.requests.delete(id);
  },

  async duplicate(id: string): Promise<string | null> {
    const original = await this.getById(id);
    if (!original) return null;

    const newId = uuidv4();
    const now = new Date().toISOString();

    const duplicateRequest = {
      ...original,
      id: newId,
      name: `${original.name} Copy`,
      created_at: now,
      updated_at: now,
    };

    await db.requests.add(duplicateRequest);
    return newId;
  },
};
