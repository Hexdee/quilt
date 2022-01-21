import create from "zustand";
import produce from "immer";
import { SHA256 } from "crypto-js";

interface MessageType {
  sender: string;
  message: string;
  date: number;
}

interface useMessagesStore {
  messages: Map<string, Array<MessageType>>;
  storedMessages: Set<string>;
  addMessage: (message: MessageType) => void;
}

export const useMessages = create<useMessagesStore>((set, get) => ({
  messages: new Map(),
  storedMessages: new Set(),
  addMessage: (message: MessageType) =>
    set((state) => {
      const username = message.sender;
      const hashedMessage = SHA256(username + message.date).toString();

      // if message is already stored do not change state
      if (state.storedMessages.has(hashedMessage)) {
        return {
          messages: state.messages,
          storedMessages: state.storedMessages,
        };
      }

      // prepare variables for changing nested state
      let messagesAppended = state.messages;
      let newUserMessages: Array<MessageType> = [];

      // if user already has some saved messages append it
      if (messagesAppended.has(username)) {
        newUserMessages = messagesAppended.get(username) as MessageType[];
        messagesAppended.set(username, [...newUserMessages, message]);
      } else {
        newUserMessages = [message];
      }

      const newStoredMessages = state.storedMessages.add(hashedMessage);
      messagesAppended.set(username, newUserMessages);

      return { messages: messagesAppended, storedMessages: newStoredMessages };
    }),
}));
