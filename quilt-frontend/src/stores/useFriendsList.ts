import create from "zustand";
import produce from "immer";

interface FriendDetails {
  username?: string;
}

export type FriendsType = { [address: string]: FriendDetails };

interface useFriendsListStore {
  friends: FriendsType;
  addFriend: (address: string, details: FriendDetails) => void;
  removeFriend: (address: string) => void;
  setFriends: (newFriends: FriendsType) => void;
}

export const useFriendsList = create<useFriendsListStore>((set) => ({
  friends: {},
  addFriend: (address: string, details: FriendDetails) =>
    set(
      produce<useFriendsListStore>((state) => {
        state.friends[address] = details;
      })
    ),
  removeFriend: (address: string) =>
    set(
      produce<useFriendsListStore>((state) => {
        delete state.friends[address];
      })
    ),
  setFriends: (newFriends: FriendsType) => set({ friends: newFriends }),
}));
