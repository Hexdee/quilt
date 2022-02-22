import create from "zustand";
import { SHA256 } from "crypto-js";

export interface MessageType {
  name: string;
  message: string;
  createdAt: number;
}

interface useMessagesStore {
  messages: Map<string, Array<MessageType>>;
  storedMessages: Set<string>;
  recieverAddress: string;
  setRecieverAddress: (address: string) => void;
  addMessage: (message: MessageType) => void;
  addSelf: (message: MessageType, recieverAddress: string) => void;
}

export const useMessages = create<useMessagesStore>((set, get) => ({
  messages: new Map(),
  storedMessages: new Set(),
  recieverAddress: "",
  setRecieverAddress: (address: string) =>
    set({
      recieverAddress: address,
    }),
  addMessage: (message: MessageType) =>
    set((state) => {
      const username = message.name;
      const hashedMessage = SHA256(
        username + message.createdAt.toString()
      ).toString();

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
        newUserMessages = [
          message,
          ...(messagesAppended.get(username) as MessageType[]),
        ];
      } else {
        newUserMessages = [message];
      }

      newUserMessages.sort((a, b) => b.createdAt - a.createdAt);
      //newUserMessages = newUserMessages.slice(0, 20);

      const newStoredMessages = state.storedMessages.add(hashedMessage);
      messagesAppended.set(username, newUserMessages);

      return { messages: messagesAppended, storedMessages: newStoredMessages };
    }),
  addSelf: (message: MessageType, recieverAddress: string) =>
    set((state) => {
      const username = message.name;
      const hashedMessage = SHA256(
        username + message.createdAt.toString()
      ).toString();

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
      if (messagesAppended.has(recieverAddress)) {
        newUserMessages = [
          message,
          ...(messagesAppended.get(recieverAddress) as MessageType[]),
        ];
      } else {
        newUserMessages = [message];
      }

      newUserMessages.sort((a, b) => b.createdAt - a.createdAt);
      //newUserMessages = newUserMessages.slice(0, 20);

      const newStoredMessages = state.storedMessages.add(hashedMessage);
      messagesAppended.set(recieverAddress, newUserMessages);

      return { messages: messagesAppended, storedMessages: newStoredMessages };
    }),
}));
