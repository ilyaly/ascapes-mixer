/**
 * Delete the IndexedDB database
 * @param {string} dbName - The name of the database to delete
 * @returns {Promise<void>} - Resolves when the database is successfully deleted
 */
export function deleteDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      console.info(`Database ${dbName} deleted successfully.`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(`Error deleting database ${dbName}:`, event.target.error);
      reject(event.target.error);
    };

    request.onblocked = () => {
      console.warn(`Database ${dbName} is blocked and cannot be deleted.`);
      reject(new Error(`Database ${dbName} is blocked and cannot be deleted.`));
    };
  });
}

/**
 * Register a store for creation
 * @param {string} dbName - Database name
 * @param {string} storeName - Store name to create
 * @returns {Promise<void>}
 */
export function registerStore(dbName, storeName) {
  return new Promise((resolve, reject) => {
    // First open to get current version
    const request = indexedDB.open(dbName);

    request.onerror = (event) =>
      reject(`Store creation error: ${event.target.error}`);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const currentVersion = db.version;
      db.close();

      // Reopen with incremented version
      const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);

      upgradeRequest.onerror = (event) =>
        reject(`Store creation error: ${event.target.error}`);

      upgradeRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: "id" });
          /*
                    Seems good to make the index unique, however it makes hard to handle order changes
                    when we have to change item.index on drag and drop.

                    store.createIndex('index', 'index', { unique: true });
                    */
        }
      };

      upgradeRequest.onsuccess = (event) => {
        event.target.result.close();
        resolve();
      };
    };
  });
}

/**
 * Write data to the database
 * @param {string} dbName - Database name
 * @param {string} storeName - Store name
 * @param {Array|Object} newItems - Single item or array of items to write
 * @returns {Promise<void>}
 */
export function writeData(dbName, storeName, newItems) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = (event) =>
      reject(`Database error: ${event.target.error}`);

    request.onsuccess = async (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      // Read existing items
      const existingItems = await new Promise((resolveRead, rejectRead) => {
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolveRead(getAllRequest.result);
        getAllRequest.onerror = () => rejectRead([]);
      });

      // Determine items to add and delete
      const existingIds = new Set(existingItems.map((item) => item.id));
      const newIds = new Set(newItems.map((item) => item.id));

      // Delete items no longer in the new set
      const toDelete = existingItems.filter((item) => !newIds.has(item.id));
      toDelete.forEach((item) => store.delete(item.id));

      // Add or update new items
      newItems.forEach((item) => store.put(item));

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = (event) =>
        reject(`Transaction error: ${event.target.error}`);
    };
  });
}

/**
 * Read all data from a store
 * @param {string} dbName - Database name
 * @param {string} storeName - Store name
 * @returns {Promise<Array>}
 */
export function readData(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = (event) =>
      reject(`Database error: ${event.target.error}`);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const dataRequest = store.getAll();

      dataRequest.onsuccess = () => {
        db.close();
        resolve(dataRequest.result);
      };
      dataRequest.onerror = (event) =>
        reject(`Read error: ${event.target.error}`);
    };
  });
}

/**
 * Delete an item by ID
 * @param {string} dbName - Database name
 * @param {string} storeName - Store name
 * @param {string|number} id - Record ID to delete
 * @returns {Promise<void>}
 */
export function deleteData(dbName, storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = (event) =>
      reject(`Database error: ${event.target.error}`);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => {
        db.close();
        resolve();
      };
      deleteRequest.onerror = (event) =>
        reject(`Delete error: ${event.target.error}`);
    };
  });
}

/**
 * Clear all records from a store
 * @param {string} dbName - Database name
 * @param {string} storeName - Store name
 * @returns {Promise<void>}
 */
export function clearStore(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = (event) =>
      reject(`Database error: ${event.target.error}`);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        db.close();
        resolve();
      };
      clearRequest.onerror = (event) =>
        reject(`Clear error: ${event.target.error}`);
    };
  });
}
