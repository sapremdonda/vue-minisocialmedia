const DB_NAME = 'MiniSocialDB';
const DB_VERSION = 2;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('users')) {
        const users = db.createObjectStore('users', { keyPath: 'id' });
        users.createIndex('username', 'username', { unique: true });
      }

      if (!db.objectStoreNames.contains('posts')) {
        const posts = db.createObjectStore('posts', { keyPath: 'id' });
        posts.createIndex('author_id', 'author_id', { unique: false });
        posts.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('likes')) {
        const likes = db.createObjectStore('likes', { keyPath: 'id' });
        likes.createIndex('post_id', 'post_id', { unique: false });
        likes.createIndex('user_id', 'user_id', { unique: false });
        likes.createIndex('post_user', ['post_id', 'user_id'], { unique: true });
      }

      if (!db.objectStoreNames.contains('follows')) {
        const follows = db.createObjectStore('follows', { keyPath: 'id' });
        follows.createIndex('follower_id', 'follower_id', { unique: false });
        follows.createIndex('following_id', 'following_id', { unique: false });
        follows.createIndex('follower_following', ['follower_id', 'following_id'], { unique: true });
      }

      if (!db.objectStoreNames.contains('comments')) {
        const comments = db.createObjectStore('comments', { keyPath: 'id' });
        comments.createIndex('post_id', 'post_id', { unique: false });
      }
    };
  });
};

export const addData = async (storeName, data) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllData = async (storeName) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllByIndex = async (storeName, indexName, value) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteData = async (storeName, id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};