import { ethers } from "ethers";
import create from "zustand";
import { EllipticCurveInterface } from "../scripts/ECDH/curveFactory";
import { EncryptorInterface } from "../scripts/encryption/encryption";

interface EncryptionStore {
  curve: EllipticCurveInterface | null;
  encryptor: EncryptorInterface | null;
  privateKey: string;
  setPrivateKey: (newKey: string) => void;
  setCurve: (newCurve: EllipticCurveInterface) => void;
  setEncryptor: (newEncryptor: EncryptorInterface) => void;
}

export const useEncryption = create<EncryptionStore>((set) => ({
  curve: null,
  encryptor: null,
  privateKey: "",
  setPrivateKey: (newKey: string) => set(() => ({ privateKey: newKey })),
  setCurve: (newCurve: EllipticCurveInterface) =>
    set(() => ({ curve: newCurve })),
  setEncryptor: (newEncryptor: EncryptorInterface) =>
    set(() => ({ encryptor: newEncryptor })),
}));
