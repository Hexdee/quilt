import CryptoJS from "crypto-js";

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

export const createEncryptor = () => {
  let sharedSecrets: Map<string, string> = new Map();

  const getSharedSecret = (userId: string) => {
    return sharedSecrets.get(userId);
  };

  const setSharedSecret = (userId: string, secret: string) => {
    sharedSecrets.set(userId, secret);
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
    } catch (error: any) {
      console.log(error.message);
      return "";
    }
  };

  return {
    getSharedSecret: getSharedSecret,
    setSharedSecret: setSharedSecret,
    encrypt: encrypt,
    decrypt: decrypt,
  };
};
