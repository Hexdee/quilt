import create from "zustand";
import {
  createEllipticCurve,
  EllipticCurveInterface,
} from "../modules/ECDH/curveFactory";
import {
  createEncryptor,
  EncryptorInterface,
} from "../modules/encryption/encryption";

interface EncryptionStore {
  curve: EllipticCurveInterface;
  encryptor: EncryptorInterface;
  privateKey: string;
  setPrivateKey: (newKey: string) => void;
  setCurve: (newCurve: EllipticCurveInterface) => void;
  setEncryptor: (newEncryptor: EncryptorInterface) => void;
}

export const useEncryption = create<EncryptionStore>((set) => ({
  curve: createEllipticCurve("secp256r1"),
  encryptor: createEncryptor(),
  privateKey: "",
  setPrivateKey: (newKey: string) => set({ privateKey: newKey }),
  setCurve: (newCurve: EllipticCurveInterface) => set({ curve: newCurve }),
  setEncryptor: (newEncryptor: EncryptorInterface) =>
    set({ encryptor: newEncryptor }),
}));
