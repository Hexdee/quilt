import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { BigNumber } from "ethers";

import { useEncryption } from "../../stores/useEncryption";
import { useMessages } from "../../stores/useMessages";
import { useUserData } from "../../stores/useUserData";

import { storePrivateKey } from "../../modules/storage/storeAccount";
import { trimEthereumAddress } from "../../helpers/trimEthereumAddress";
import { useContracts } from "../../stores/useContracts";
import { useProvider } from "../../stores/useProvider";
import { useMessagingChannel } from "../../hooks/useMessagingChannel";
import { useGunConnection } from "../../stores/useGunConnection";
import { HashLoader } from "react-spinners";

interface ChatProps {
  isGeneratingSharedKey: boolean;
}

export const Chat: React.FC<ChatProps> = ({ isGeneratingSharedKey }) => {
  const [message, setMessage] = useState("");
  const addMessage = useMessages((state) => state.addMessage);
  const recieverAddress = useMessages((state) => state.recieverAddress);
  const messagesStoreUser = useMessages(
    (state) => state.messages[recieverAddress]
  );
  const userAddress = useUserData((state) => state.address);
  const encryptor = useEncryption((state) => state.encryptor);
  const privateKey = useEncryption((state) => state.privateKey);
  const curve = useEncryption((state) => state.curve);
  const keyStorage = useContracts((state) => state.contract);
  const provider = useProvider((state) => state.provider);
  const setPrivateKey = useEncryption((state) => state.setPrivateKey);
  const gun = useGunConnection((state) => state.gun);
  const user = useGunConnection((state) => state.gunUser);

  useMessagingChannel(recieverAddress);

  const generateKeyPair = async () => {
    try {
      if (!curve) throw new Error("Encryption initialization failed");
      if (!(keyStorage && provider))
        throw new Error("Failed to connect with contract");

      const [privateKey, publicKey] = curve.makeKeyPair();

      if (!publicKey || !privateKey) return;

      await keyStorage.setUserKey(
        BigNumber.from(publicKey.x.toString(10)),
        BigNumber.from(publicKey.y.toString(10))
      );

      setPrivateKey(privateKey.toString(10));
      storePrivateKey(privateKey.toString(10));

      toast.success("Successfully generated a new key");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Sending messages
  const saveMessage = () => {
    if (!privateKey)
      return toast.error("Generate a private key before sending the message.");

    if (!(user && user.user)) {
      toast.error("Not logged in");
      return;
    }

    if (!encryptor) {
      toast.error("Error while initalizing encryption");
      return;
    }

    if (!gun) {
      toast.error("Cannot connect with gunDB");
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
    addMessage(messageData, recieverAddress);
    setMessage("");
  };

  if (!privateKey) {
    return (
      <button
        onClick={() => generateKeyPair()}
        className="bg-gradient-to-bl from-sky-600 to-blue-700 p-4 text-white h-[70px] text-lg w-2/3 block mt-16 rounded-lg"
      >
        Generate new private key
      </button>
    );
  }

  return (
    <div className="w-2/3 border-x border-gray-700 overflow-hidden h-[88vh] relative px-10 flex flex-col">
      <div className="text-base text-gray-400 pt-6">Chatting with:</div>
      <div className="text-2xl font-bold">{recieverAddress}</div>
      {isGeneratingSharedKey ? (
        <div className="mx-auto h-auto mt-28">
          <HashLoader color="white"></HashLoader>
        </div>
      ) : (
        <>
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
              <IoSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
