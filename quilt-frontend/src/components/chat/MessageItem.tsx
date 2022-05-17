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
        <div className="mt-2 flex flex-col items-start">
          <div className="btn-gray btn-send mb-1 mt-3 min-w-[40px] max-w-[320px] rounded-3xl rounded-bl-none">
            <div className="px-6 py-3 text-base text-white">
              {decryptedMessage}
            </div>
          </div>
          <div className="text-sm text-gray-600">{formatedMessageData}</div>
        </div>
      );
    }

    // sent message
    return (
      <div className="mt-2 flex flex-col items-end">
        <div className="btn-send mb-1 mt-3 min-w-[40px] max-w-[320px] rounded-3xl rounded-br-none">
          <div className="px-6 py-3 text-base text-white">
            {decryptedMessage}
          </div>
        </div>
        <div className="text-sm text-gray-500">{formatedMessageData}</div>
      </div>
    );
  }
);
