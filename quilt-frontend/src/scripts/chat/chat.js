import { useState, useEffect } from "react";
import Gun from "gun";
import BN from "bn.js";
import { useMessages } from "../../stores/useMessages";
import { useUserData } from "../../stores/useUserData";
import { useEncryption } from "../../stores/useEncryption";
import { useContracts } from "../../stores/useContracts";
require("gun/sea");

// initialize gun locally
const gun = Gun({
  peers: ["http://localhost:3030/gun", "https://quilt-chat.herokuapp.com/gun"],
});

const Chat = (props) => {
  const user = props.user;
  const [message, setMessage] = useState("");
  const addMessages = useMessages((state) => state.addMessage);
  const addSelf = useMessages((state) => state.addSelf);
  const [recieverAddressInput, setRecieverAddressInput] = useState("");
  const [recieverAddress, setRecieverAddress] = useState("");
  const messagesStoreUser = useMessages((state) =>
    state.messages.get(recieverAddress)
  );
  const userAddress = useUserData((state) => state.address);
  const curve = useEncryption((state) => state.curve);
  const encryptor = useEncryption((state) => state.encryptor);
  const privateKey = useEncryption((state) => state.privateKey);
  const contract = useContracts((state) => state.contract);
  const [sharedSecret, setSharedSecret] = useState("");

  const changeTargetUsername = async () => {
    if (!curve) return alert("curve is not defined");
    if (!privateKey) return alert("private key is not generated");

    console.log(`Getting public key of -> ${recieverAddress}`);
    setRecieverAddress(recieverAddressInput);
    const targetUserPublicKey = await contract.getUserKey(recieverAddress);

    if (!targetUserPublicKey) return alert("failed to fetch public key");
    console.log(`fetched public key X -> ${targetUserPublicKey.x.toString()}`);
    console.log(`fetched public key X -> ${targetUserPublicKey.y.toString()}`);

    const targetUserPublicKeyTrans = {
      x: new BN(targetUserPublicKey.x.toString(), 10),
      y: new BN(targetUserPublicKey.y.toString(), 10),
    };

    const sharedSecret = curve.generateSharedSecret(
      new BN(privateKey, 10),
      targetUserPublicKeyTrans
    );
    console.log(`generated shared key -> ${sharedSecret.toString()}`);

    setSharedSecret(sharedSecret.toString());
    encryptor.setSharedSecret(recieverAddress, sharedSecret.toString());
  };

  // Sending messages
  const saveMessage = () => {
    if (user.is) {
      console.log("sending");
      console.log("to -> " + recieverAddress);
      console.log("from -> " + userAddress);
      console.log("message -> " + message);

      const encryptedMessage = encryptor
        .encrypt(message, recieverAddress)
        .toString();

      console.log("message (encrypted) -> " + encryptedMessage);
      const messages = gun.get(recieverAddress);
      const messageData = {
        name: userAddress,
        message: encryptedMessage,
        createdAt: Date.now(),
      };
      messages.set(messageData);
      addSelf(messageData, recieverAddress);
    } else {
      alert("Not logged in");
      setMessage("");
      return;
    }
  };

  // Listening
  useEffect(() => {
    const messages = gun.get(userAddress);
    console.log("listening on topic -> " + userAddress);
    messages.map().on((m) => {
      addMessages(m);
    });

    return () => {
      messages.off();
    };
  }, [userAddress, addMessages]);

  useEffect(() => {
    if (messagesStoreUser) {
      console.log(`updating store [${recieverAddress}]`);
      console.log(messagesStoreUser);
    }
  }, [messagesStoreUser, recieverAddress]);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={saveMessage}
        className="border-2 border-yellow-500 bg-yellow-300 p-4 rounded-2xl text-black w-60 h-16 m-2 inline-block"
      >
        Send Message
      </button>
      <input
        id="message"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Message"
        name="message"
        value={message}
        className="ml-5 p-5 w-96 text-black rounded-lg"
      />
      <div>
        <button
          type="button"
          onClick={changeTargetUsername}
          className="border-2 border-yellow-500 bg-yellow-300 p-4 rounded-2xl text-black w-60 h-16 m-2 inline-block"
        >
          Change
        </button>
        <input
          id="address"
          onChange={(e) => {
            setRecieverAddressInput(e.target.value);
          }}
          placeholder="Reciever address"
          name="address"
          value={recieverAddressInput}
          className="ml-5 p-5 w-96 text-black rounded-lg"
        />
      </div>
      <div className="mt-10 text-xl">Messages</div>
      <div>
        {messagesStoreUser &&
          messagesStoreUser.map((message) => {
            let decryptedMessage = "";

            if (!encryptor) {
              decryptedMessage = message.message;
            } else {
              decryptedMessage = encryptor.decrypt(
                message.message,
                recieverAddress
              );
            }

            console.log(`decryptedMessage: ${decryptedMessage}`);

            return (
              <div className="border rounded-lg p-3 my-3">
                <div className="text-2xl font-bold mb-2">{message.name}</div>
                <div className="mb-4 text-xl ml-3">{decryptedMessage}</div>
                <div className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Chat;
