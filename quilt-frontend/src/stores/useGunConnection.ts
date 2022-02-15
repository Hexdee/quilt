import create from "zustand";
import { GunConnectionType } from "../types/GunTypes";

interface useGunConnectionStore {
  gun: GunConnectionType | null;
  setGunConnection: (connection: GunConnectionType) => void;
}

export const useGunConnection = create<useGunConnectionStore>((set) => ({
  gun: null,
  setGunConnection: (connection: GunConnectionType) => set({ gun: connection }),
}));
