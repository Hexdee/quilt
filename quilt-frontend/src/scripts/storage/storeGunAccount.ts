const STORAGE_KEY = "useraccount";

export const storeAccount = (privateKey: string) => {
  localStorage.setItem(STORAGE_KEY, privateKey);
};
export const readAccount = () => {
  return localStorage.getItem(STORAGE_KEY);
};
