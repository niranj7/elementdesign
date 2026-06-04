const DB_NAME = "element_designs_db";
const DB_VERSION = 1;
const STORE_NAME = "key_value_store";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getValue<T>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB error, falling back to localStorage:", err);
    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : null;
  }
}

export async function setValue<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB error, falling back to localStorage:", err);
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function initializeStore() {
  if (typeof window === "undefined") return;

  const localProjects = localStorage.getItem("element_designs_projects");
  const dbProjects = await getValue("element_designs_projects");
  if (localProjects && !dbProjects) {
    try {
      await setValue("element_designs_projects", JSON.parse(localProjects));
    } catch (e) {
      console.error("Failed to migrate projects", e);
    }
  }

  const localLeads = localStorage.getItem("element_designs_contact_submissions");
  const dbLeads = await getValue("element_designs_contact_submissions");
  if (localLeads && !dbLeads) {
    try {
      await setValue("element_designs_contact_submissions", JSON.parse(localLeads));
    } catch (e) {
      console.error("Failed to migrate leads", e);
    }
  }
}
