import { useEncryption } from "../../stores/useEncryption";
import { useMessages } from "../../stores/useMessages";
import { useUserData } from "../../stores/useUserData";
import { gunDbAddress } from "../../constants/gundb";
import { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import Gun from "gun";
import "gun/sea";
import { IGunChainReference } from "gun/types/chain";

// initialize gun
const gun = Gun({
  peers: [gunDbAddress],
});

type GunUser = IGunChainReference<Record<string, any>, any, false>;

interface ChatProps {
  wallet: string;
  user: GunUser;
}

export const Chat: React.FC<ChatProps> = ({ user }) => {
  const [message, setMessage] = useState("");
  const addMessages = useMessages((state) => state.addMessage);
  const addSelf = useMessages((state) => state.addSelf);
  const recieverAddress = useMessages((state) => state.recieverAddress);
  const messagesStoreUser = useMessages((state) =>
    state.messages.get(recieverAddress)
  );
  const userAddress = useUserData((state) => state.address);
  const encryptor = useEncryption((state) => state.encryptor);
  const privateKey = useEncryption((state) => state.privateKey);

  // Sending messages
  const saveMessage = () => {
    if (!privateKey)
      return toast.error("Generate a private key before sending the message.");

    if (!user.user) {
      toast.error("Not logged in");
      return;
    }

    if (!encryptor) {
      toast.error("Error while initalizing encryption");
      return;
    }

    const encryptedMessage = encryptor.encrypt(message, recieverAddress);

    if (!encryptedMessage) {
      toast.error("Cannot encrypt the message!");
      return;
    }

    const messages = gun.get(recieverAddress);
    const messageData = {
      name: userAddress,
      message: encryptedMessage.toString(),
      createdAt: Date.now(),
    };
    messages.set(messageData);
    addSelf(messageData, recieverAddress);
    setMessage("");
  };

  // Listening
  useEffect(() => {
    const messages = gun.get(userAddress);
    messages.map().on((...props) => {
      const m = props[0];
      addMessages(m);
    });

    return () => {
      messages.off();
    };
  }, [userAddress, addMessages]);

  // Listening to user messages
  useEffect(() => {
    if (!recieverAddress) return;

    const messages = gun.get(recieverAddress);
    messages.map().on((...props) => {
      const m = props[0];

      if (props[0].name === userAddress) {
        addSelf(m, recieverAddress);
      }
    });

    return () => {
      messages.off();
    };
  }, [recieverAddress, userAddress, addSelf]);

  return (
    <div className="w-2/3 border-x border-gray-700 overflow-hidden h-[88vh] relative px-10 flex flex-col">
      <div className="text-base text-gray-400 pt-6">Chatting with:</div>
      <div className="text-4xl font-bold">
        {recieverAddress ? `${recieverAddress.substring(0, 26)} . . .` : "-"}
      </div>
      <div className="mt-4 overflow-y-scroll scrollbar-hide flex flex-col-reverse h-[65vh]">
        {messagesStoreUser &&
          messagesStoreUser.map((message) => {
            // check if encryptor is initialized
            if (!encryptor) return null;
            const decryptedMessage =
              encryptor.decrypt(message.message, recieverAddress) ?? "";

            //if (!decryptedMessage) return () => null;

            // receiver messages
            if (message && message.name === recieverAddress) {
              return (
                <div className="flex flex-col items-start mt-2">
                  <div className="max-w-[320px] min-w-[40px] bg-gradient-to-bl from-slate-800 to-slate-800 mb-1 mt-3 rounded-3xl rounded-bl-none">
                    <div className="text-base px-6 py-3 text-gray-200">
                      {decryptedMessage}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            }

            // user messages
            return (
              <div className="flex flex-col items-end mt-2">
                <div className="max-w-[320px] min-w-[40px] bg-gradient-to-bl from-sky-500 to-blue-600 mb-1 mt-3 rounded-3xl rounded-br-none">
                  <div className="text-base px-6 py-3 text-white">
                    {decryptedMessage}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })}
      </div>
      <div className="mt-4 flex flex-row items-stretch absolute bottom-5 w-[90%]">
        <input
          id="message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Write a message..."
          name="message"
          value={message}
          className="p-5 text-gray-200 rounded-2xl h-[70px] flex-1 mr-4 bg-transparent border border-gray-600"
        />
        <button
          type="button"
          onClick={() => saveMessage()}
          className="bg-gradient-to-bl from-sky-600 to-blue-700 text-white p-4 rounded-xl w-24 h-[70px] text-lg flex items-center justify-center transition-all hover:border-4 duration-200"
        >
          <IoSend></IoSend>
        </button>
      </div>
    </div>
  );
};
