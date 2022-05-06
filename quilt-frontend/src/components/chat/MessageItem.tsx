import React, { memo } from "react";
import { useEncryption } from "../../stores/useEncryption";
import { MessageType } from "../../stores/useMessages";

interface MessageItemProps {
  message: MessageType;
  recieverAddress: string;
}

export const MessageItem: React.FC<MessageItemProps> = memo(
  ({ message, recieverAddress }) => {
    const encryptor = useEncryption((state) => state.encryptor);

    if (!encryptor || !message) return null;
    const decryptedMessage =
      encryptor.decrypt(message.message, recieverAddress) ?? "";

    const formatedMessageData = new Date(message.createdAt).toLocaleString();

    if (message.name === recieverAddress) {
      // received message
      return (
        <div className="flex flex-col items-start mt-2">
          <div className="max-w-[320px] min-w-[40px] btn-gray mb-1 btn-send mt-3 rounded-3xl rounded-bl-none">
            <div className="text-base px-6 py-3 text-white">
              {decryptedMessage}
            </div>
          </div>
          <div className="text-sm text-gray-600">{formatedMessageData}</div>
        </div>
      );
    }

    // sent message
    return (
      <div className="flex flex-col items-end mt-2">
        <div className="max-w-[320px] min-w-[40px] btn-send mb-1 mt-3 rounded-3xl rounded-br-none">
          <div className="text-base px-6 py-3 text-white">
            {decryptedMessage}
          </div>
        </div>
        <div className="text-sm text-gray-500">{formatedMessageData}</div>
      </div>
    );
  }
);
