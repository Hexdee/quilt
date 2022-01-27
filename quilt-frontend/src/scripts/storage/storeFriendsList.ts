const FRIENDS_LIST_KEY = "friendList";

export const storeFriendsList = (friendsList: Array<string>) => {
  const serializedArray = JSON.stringify(friendsList);
  localStorage.setItem(FRIENDS_LIST_KEY, serializedArray);
};
export const readFriendsList = () => {
  const serializedArray = localStorage.getItem(FRIENDS_LIST_KEY);

  if (!serializedArray) return;

  return JSON.parse(serializedArray);
};
