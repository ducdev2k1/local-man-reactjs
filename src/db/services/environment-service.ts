import { v4 as uuidv4 } from 'uuid';
import type { IEnvironment } from '../../Types/models';
import { db } from '../database';

export const environmentService = {
  async getAll(): Promise<IEnvironment[]> {
    return db.environments.orderBy('updated_at').reverse().toArray();
  },

  async getById(id: string): Promise<IEnvironment | undefined> {
    return db.environments.get(id);
  },

  async create(data: Partial<IEnvironment>): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    // If setting as active, deactivate others
    if (data.is_active) {
      await this.deactivateAll();
    }

    const newEnv: IEnvironment = {
      id,
      name: data.name || 'New Environment',
      variables: data.variables || [],
      is_active: data.is_active || false,
      created_at: now,
      updated_at: now,
    };

    await db.environments.add(newEnv);
    return id;
  },

  async update(id: string, data: Partial<IEnvironment>): Promise<number> {
    const now = new Date().toISOString();
    
    // If setting as active, deactivate others
    if (data.is_active) {
      await this.deactivateAll();
    }

    return db.environments.update(id, {
      ...data,
      updated_at: now,
    });
  },

  async delete(id: string): Promise<void> {
    await db.environments.delete(id);
  },

  async deactivateAll(): Promise<void> {
    const activeEnvs = await db.environments.where('is_active').equals(1).toArray() || await db.environments.filter(e => e.is_active).toArray();
    const updates = activeEnvs.map(e => db.environments.update(e.id, { is_active: false }));
    await Promise.all(updates);
  },

  async setActive(id: string): Promise<void> {
    await this.update(id, { is_active: true });
  }
};
