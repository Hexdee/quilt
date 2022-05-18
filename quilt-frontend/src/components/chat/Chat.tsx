import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { BigNumber } from "ethers";

import { useEncryption } from "../../stores/useEncryption";
import { useMessages } from "../../stores/useMessages";
import { useUserData } from "../../stores/useUserData";

import { storePrivateKey } from "../../modules/storage/storeAccount";
import { useContracts } from "../../stores/useContracts";
import { useProvider } from "../../stores/useProvider";
import { useMessagingChannel } from "../../hooks/useMessagingChannel";
import { useGunConnection } from "../../stores/useGunConnection";
import { HashLoader } from "react-spinners";
import { MessageItem } from "./MessageItem";
import { useFriendsList } from "../../stores/useFriendsList";

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

  const username = useFriendsList.getState().friends[recieverAddress].username;
  const setUsername = useFriendsList((state) => state.setUsername);

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
      console.log(err);
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
        className="secondary-button block w-1/3"
      >
        Generate New Private Key
      </button>
    );
  }

  return (
    <div className="chat-layout relative flex h-[88vh] flex-col overflow-hidden px-10">
      <div className="pt-6 text-base text-gray-400">Chatting with:</div>
      <div className="text-2xl font-bold text-white">
        <input
          value={username ?? recieverAddress}
          onChange={(event) => setUsername(recieverAddress, event.target.value)}
        ></input>
      </div>
      {isGeneratingSharedKey ? (
        <div className="mx-auto mt-28 h-auto">
          <HashLoader color="white" />
        </div>
      ) : (
        <>
          <div className="mt-4 flex h-[65vh] flex-col-reverse overflow-y-scroll scrollbar-hide">
            {messagesStoreUser?.map((message, index) => (
              <MessageItem
                key={index}
                message={message}
                recieverAddress={recieverAddress}
              />
            ))}
          </div>
          <div className="absolute bottom-5 mt-4 flex w-[90%] flex-row items-stretch">
            <input
              id="message"
              className="mr-4 h-[70px] flex-1 rounded-2xl border border-gray-600 bg-transparent p-5 text-gray-200"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Write a message..."
              name="message"
              value={message}
            />
            <button
              type="button"
              onClick={() => saveMessage()}
              className="connectWallet-btn flex h-[70px] w-24 items-center justify-center rounded-xl p-4 text-lg text-white transition-all duration-200 hover:border-4"
            >
              <IoSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
