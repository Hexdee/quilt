import CryptoJS from "crypto-js";

const SHARED_SECRET_STORAGE_PREFIX = "sharedsecret";

export interface EncryptorInterface {
  getSharedSecret: (userId: string) => string | undefined;
  setSharedSecret: (userId: string, secret: string) => void;
  encrypt: (
    message: string,
    userId: string
  ) => CryptoJS.lib.CipherParams | undefined;
  decrypt: (
    message: string | CryptoJS.lib.CipherParams,
    userId: string
  ) => string | undefined;
}

const storeToStorageWithPrefix = (key: string, value: string) => {
  localStorage.setItem(SHARED_SECRET_STORAGE_PREFIX + key, value);
};

const readStorageWithPrefix = (key: string) => {
  return localStorage.getItem(SHARED_SECRET_STORAGE_PREFIX + key);
};

export const createEncryptor = () => {
  let sharedSecrets: Map<string, string> = new Map(); // there is one sharedSecret for each user pair

  const getSharedSecret = (userId: string) => {
    if (!sharedSecrets.get(userId)) {
      const readSecret = readStorageWithPrefix(userId);

      if (!readSecret) return undefined;

      sharedSecrets.set(userId, readSecret);
    }

    return sharedSecrets.get(userId) as string;
  };

  const setSharedSecret = (userId: string, secret: string) => {
    sharedSecrets.set(userId, secret);
    storeToStorageWithPrefix(userId, secret);
  };

  const encrypt = (message: string, userId: string) => {
    const secret = getSharedSecret(userId);

    if (!secret) return undefined;

    return CryptoJS.AES.encrypt(message, secret);
  };

  const decrypt = (
    message: string | CryptoJS.lib.CipherParams,
    userId: string
  ) => {
    const secret = getSharedSecret(userId);

    if (!secret) return undefined;

    try {
      return CryptoJS.AES.decrypt(message, secret).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return "[ ERROR: cannot decrypt ] user possibly generated a new public key or is being impersonated";
    }
  };

  return {
    getSharedSecret: getSharedSecret,
    setSharedSecret: setSharedSecret,
    encrypt: encrypt,
    decrypt: decrypt,
  };
};
