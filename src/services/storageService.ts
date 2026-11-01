/**
 * Storage Service
 * Handles persistent client-side storage using localStorage for lightweight metadata
 * and IndexedDB for large image data URLs / binary blobs.
 */

import { OrderItem, StoredCurrentDesign, OrderStatus } from '../types';

const DB_NAME = 'atelier_tshirt_db';
const DB_VERSION = 1;
const IMAGE_STORE = 'image_blobs';

const STORAGE_KEYS = {
  PRODUCT: 'tshirt_product',
  CURRENT_DESIGN: 'tshirt_current_design',
  ORDERS: 'tshirt_orders',
};

// Open IndexedDB instance safely
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save large image string (data URL) to IndexedDB
 */
export async function saveImageToIndexedDB(id: string, dataUrl: string): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IMAGE_STORE, 'readwrite');
      const store = transaction.objectStore(IMAGE_STORE);
      const req = store.put({ id, dataUrl, savedAt: Date.now() });

      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Fallback: Failed to save to IndexedDB, saving to sessionStorage', err);
    try {
      sessionStorage.setItem(`blob_${id}`, dataUrl);
    } catch (e) {
      console.error('Session storage failed', e);
    }
    return id;
  }
}

/**
 * Retrieve image from IndexedDB
 */
export async function getImageFromIndexedDB(id: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IMAGE_STORE, 'readonly');
      const store = transaction.objectStore(IMAGE_STORE);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          resolve(req.result.dataUrl);
        } else {
          // Check fallback
          const fallback = sessionStorage.getItem(`blob_${id}`);
          resolve(fallback || null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to read from IndexedDB, trying sessionStorage fallback', err);
    return sessionStorage.getItem(`blob_${id}`);
  }
}

/**
 * Delete image from IndexedDB
 */
export async function deleteImageFromIndexedDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IMAGE_STORE, 'readwrite');
      const store = transaction.objectStore(IMAGE_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    sessionStorage.removeItem(`blob_${id}`);
  }
}

// ==========================================
// LocalStorage Management
// ==========================================

export function saveCurrentDesign(design: StoredCurrentDesign): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DESIGN, JSON.stringify(design));
  } catch (e) {
    console.error('Failed to save current design to localStorage', e);
  }
}

export function loadCurrentDesign(): StoredCurrentDesign | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_DESIGN);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse current design from localStorage', e);
    return null;
  }
}

export function saveOrders(orders: OrderItem[]): void {
  try {
    // Strip heavy inline base64 if accidentally attached before saving to localStorage
    const lightweightOrders = orders.map((o) => {
      const clone = { ...o };
      delete clone.previewDataUrl;
      delete clone.printArtworkDataUrl;
      return clone;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(lightweightOrders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function loadOrders(): OrderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to parse orders from localStorage', e);
    return [];
  }
}

/**
 * Loads all orders and populates their preview and print image URLs from IndexedDB
 */
export async function loadOrdersWithHydratedImages(): Promise<OrderItem[]> {
  const orders = loadOrders();
  const hydrated = await Promise.all(
    orders.map(async (order) => {
      let previewUrl = order.previewDataUrl;
      let printUrl = order.printArtworkDataUrl;

      if (!previewUrl && order.previewImageId) {
        previewUrl = (await getImageFromIndexedDB(order.previewImageId)) || undefined;
      }
      if (!printUrl && order.printArtworkId) {
        printUrl = (await getImageFromIndexedDB(order.printArtworkId)) || undefined;
      }

      return {
        ...order,
        previewDataUrl: previewUrl,
        printArtworkDataUrl: printUrl,
      };
    })
  );
  return hydrated;
}

export async function deleteOrder(orderId: string): Promise<OrderItem[]> {
  const currentOrders = loadOrders();
  const target = currentOrders.find((o) => o.id === orderId);

  if (target) {
    if (target.previewImageId) {
      await deleteImageFromIndexedDB(target.previewImageId).catch(console.error);
    }
    if (target.printArtworkId) {
      await deleteImageFromIndexedDB(target.printArtworkId).catch(console.error);
    }
  }

  const updatedOrders = currentOrders.filter((o) => o.id !== orderId);
  saveOrders(updatedOrders);
  return updatedOrders;
}

/**
 * Updates the status of a specific order in localStorage
 */
export function updateOrderStatus(orderId: string, newStatus: OrderStatus): OrderItem[] {
  const currentOrders = loadOrders();
  const updatedOrders = currentOrders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status: newStatus };
    }
    return order;
  });
  saveOrders(updatedOrders);
  return updatedOrders;
}
