import create from "zustand";
import { KeyStorage } from "../ABI/typechain/KeyStorage";

interface ContractStore {
  contract: KeyStorage | null;
  setContract: (contractInstance: KeyStorage) => void;
}

export const useContracts = create<ContractStore>((set) => ({
  contract: null,
  setContract: (contractInstance: KeyStorage) =>
    set(() => ({ contract: contractInstance })),
}));
