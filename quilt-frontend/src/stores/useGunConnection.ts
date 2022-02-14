import create from "zustand";
import { IGunChainReference } from "gun/types/chain";

type GunConnectionType = IGunChainReference<any, any, "pre_root">;

interface useGunConnectionStore {
  gun: GunConnectionType | null;
  setGunConnection: (connection: GunConnectionType) => void;
}

export const useGunConnection = create<useGunConnectionStore>((set) => ({
  gun: null,
  setGunConnection: (connection: GunConnectionType) => set({ gun: connection }),
}));
