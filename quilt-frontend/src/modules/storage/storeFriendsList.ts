import { FriendsType } from "../../stores/useFriendsList";

const FRIENDS_LIST_KEY = "friendList";

export const storeFriendsList = (friendsList: FriendsType) => {
  const serializedObject = JSON.stringify(friendsList);

  localStorage.setItem(FRIENDS_LIST_KEY, serializedObject);
};
export const readFriendsList = (): FriendsType | undefined => {
  const serializedObject = localStorage.getItem(FRIENDS_LIST_KEY);
  if (!serializedObject) return;

  console.log(JSON.parse(serializedObject));

  return JSON.parse(serializedObject);
};
