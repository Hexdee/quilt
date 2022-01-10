import create from "zustand";

interface UserDataStore {
  isLogged: boolean;
  address: string;
  balance: string;
  setBalance: (newBalnce: string) => void;
  login: (address: string) => void;
  logout: () => void;
}

export const useUserData = create<UserDataStore>((set) => ({
  isLogged: false,
  address: "",
  balance: "",
  setBalance: (newBalance: string) => set(() => ({ balance: newBalance })),
  login: (address: string) => set(() => ({ address, isLogged: true })),
  logout: () => set(() => ({ address: "", isLogged: false })),
}));
