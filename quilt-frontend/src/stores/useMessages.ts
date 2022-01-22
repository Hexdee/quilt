import create from "zustand";
import produce from "immer";
import { SHA256 } from "crypto-js";

interface MessageType {
  name: string;
  message: string;
  createdAt: number;
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
      const username = message.name;
      const hashedMessage = SHA256(
        username + message.createdAt.toString()
      ).toString();

      // if message is already stored do not change state
      if (state.storedMessages.has(hashedMessage)) {
        console.log("not updating store");

        return {
          messages: state.messages,
          storedMessages: state.storedMessages,
        };
      }

      // if (message.name === "Vitcos") {
      //   console.log("storing copied message");
      //   console.log(message.name);
      //   console.log(message.message);
      //   console.log(message.createdAt);
      //   console.log(hashedMessage);
      // }

      // prepare variables for changing nested state
      let messagesAppended = state.messages;
      let newUserMessages: Array<MessageType> = [];

      // if user already has some saved messages append it
      if (messagesAppended.has(username)) {
        //newUserMessages = messagesAppended.get(username) as MessageType[];
        //messagesAppended.set(username, [...newUserMessages, message]);
        newUserMessages = [
          message,
          ...(messagesAppended.get(username) as MessageType[]),
        ];
      } else {
        newUserMessages = [message];
      }

      const newStoredMessages = state.storedMessages.add(hashedMessage);
      messagesAppended.set(username, newUserMessages);
      console.log("updating store");

      return { messages: messagesAppended, storedMessages: newStoredMessages };
    }),
}));
