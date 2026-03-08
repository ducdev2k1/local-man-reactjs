import Dexie, { type Table } from 'dexie';
import type {
  IApiRequest,
  ICollection,
  IEnvironment,
  IFolder,
  IHistoryEntry,
  ISetting,
} from '../Types/models';

export class LocalmanDB extends Dexie {
  collections!: Table<ICollection, string>; // uuid
  folders!: Table<IFolder, string>; // uuid
  requests!: Table<IApiRequest, string>; // uuid
  environments!: Table<IEnvironment, string>; // uuid
  history!: Table<IHistoryEntry, number>; // auto-inc
  settings!: Table<ISetting, string>; // key

  constructor() {
    super('localman');

    // Schema version 1
    this.version(1).stores({
      collections: 'id, name, updated_at',
      folders: 'id, collection_id, parent_id, updated_at',
      requests: 'id, collection_id, folder_id, updated_at',
      environments: 'id, name, updated_at',
      history: '++id, request_id, timestamp, method, status_code',
      settings: 'key',
    });

    // Schema version 2 - Add sort_order index
    this.version(2).stores({
      collections: 'id, name, sort_order, updated_at',
      folders: 'id, collection_id, parent_id, sort_order, updated_at',
      requests: 'id, collection_id, folder_id, sort_order, updated_at',
    });
  }
}

export const db = new LocalmanDB();
