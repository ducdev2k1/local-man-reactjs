import type { TypeHttpMethod } from '../Types/models';
import { db } from './database';
import { collectionService } from './services/collection-service';
import { requestService } from './services/request-service';

export const seedDatabase = async () => {
  // Check if there are already collections
  const existing = await collectionService.getAll();
  if (existing.length > 0) {
    return; // Already populated
  }

  // Seed Collection 1
  const c1Id = await collectionService.create({
    name: 'E-commerce API',
    description: 'Sample e-commerce collection',
    sort_order: 1,
    isOpen: true,
  });

  await requestService.create({
    collection_id: c1Id,
    name: 'Get Products',
    method: 'GET' as TypeHttpMethod,
    url: 'https://api.example.com/v1/products',
    sort_order: 1,
  });

  await requestService.create({
    collection_id: c1Id,
    name: 'Create Order',
    method: 'POST' as TypeHttpMethod,
    url: 'https://api.example.com/v1/orders',
    sort_order: 2,
  });

  await requestService.create({
    collection_id: c1Id,
    name: 'Update User Profile',
    method: 'PUT' as TypeHttpMethod,
    url: 'https://api.example.com/v1/users/me',
    sort_order: 3,
  });

  await requestService.create({
    collection_id: c1Id,
    name: 'Remove Item',
    method: 'DELETE' as TypeHttpMethod,
    url: 'https://api.example.com/v1/cart/items/42',
    sort_order: 4,
  });

  // Seed Collection 2
  const c2Id = await collectionService.create({
    name: 'Payment Gateway',
    description: 'Sample payment gateway collection',
    sort_order: 2,
    isOpen: false,
  });

  await requestService.create({
    collection_id: c2Id,
    name: 'Init Transaction',
    method: 'POST' as TypeHttpMethod,
    url: 'https://api.example.com/payment/init',
    sort_order: 1,
  });

  await requestService.create({
    collection_id: c2Id,
    name: 'Check Status',
    method: 'GET' as TypeHttpMethod,
    url: 'https://api.example.com/payment/status/txn123',
    sort_order: 2,
  });
};

export const clearDatabase = async () => {
  await db.transaction(
    'rw',
    db.collections,
    db.folders,
    db.requests,
    async () => {
      await db.requests.clear();
      await db.folders.clear();
      await db.collections.clear();
    },
  );
};
