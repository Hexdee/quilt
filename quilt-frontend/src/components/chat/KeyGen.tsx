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

interface KeyGenProps {}

export const KeyGen: React.FC<KeyGenProps> = () => {
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
        className="w-full"
      >
        Generate New Private Key
      </button>
    );
  }

  return (
    <div>
     
    </div>
  );
};
