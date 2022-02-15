import { ethers } from "ethers";
import create from "zustand";

interface ProviderStore {
  provider: ethers.providers.Web3Provider | null;
  setProvider: (newProvider: ethers.providers.Web3Provider) => void;
}

export const useProvider = create<ProviderStore>((set) => ({
  provider: null,
  setProvider: (newProvider: ethers.providers.Web3Provider) =>
    set({ provider: newProvider }),
}));
