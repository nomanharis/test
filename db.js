// Tiny IndexedDB wrapper: entries (metadata) and files (attachment blobs).
const DB = (() => {
  const NAME = 'boxfile';
  const VERSION = 1;
  let dbPromise;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('entries')) db.createObjectStore('entries', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(store, mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      const result = fn(s);
      t.oncomplete = () => resolve(result && 'result' in result ? result.result : result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  return {
    allEntries: () => tx('entries', 'readonly', (s) => s.getAll()),
    putEntry: (entry) => tx('entries', 'readwrite', (s) => s.put(entry)),
    deleteEntry: (id) => tx('entries', 'readwrite', (s) => s.delete(id)),
    getFile: (id) => tx('files', 'readonly', (s) => s.get(id)),
    putFile: (id, blob) => tx('files', 'readwrite', (s) => s.put({ id, blob })),
    deleteFile: (id) => tx('files', 'readwrite', (s) => s.delete(id)),
  };
})();
