






export const storage = {
  // Token Specific (LocalStorage)
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),

  // Generic LocalStorage
  setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  getItem: (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item; // In case it was stored as a raw string
    }
  },
  removeItem: (key) => localStorage.removeItem(key),
  clearAll: () => localStorage.clear(),

  // Generic SessionStorage
  setSession: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
  getSession: (key) => {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  },
  removeSession: (key) => sessionStorage.removeItem(key),
  clearSession: () => sessionStorage.clear(),
};
