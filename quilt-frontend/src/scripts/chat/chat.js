import { useState, useEffect } from "react";
import Gun from "gun";
import { useMessages } from "../../stores/useMessages";
import { useUserData } from "../../stores/useUserData";
import { useEncryption } from "../../stores/useEncryption";
import { toast } from "react-toastify";
require("gun/sea");

// initialize gun locally
const gun = Gun({
  peers: ["https://quilt-chat.herokuapp.com/gun"],
});

const Chat = (props) => {
  const user = props.user;
  const [message, setMessage] = useState("");
  const addMessages = useMessages((state) => state.addMessage);
  const addSelf = useMessages((state) => state.addSelf);
  const recieverAddress = useMessages((state) => state.recieverAddress);
  const messagesStoreUser = useMessages((state) =>
    state.messages.get(recieverAddress)
  );
  const userAddress = useUserData((state) => state.address);
  const encryptor = useEncryption((state) => state.encryptor);

  // Sending messages
  const saveMessage = () => {
    if (user.is) {
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
      setMessage("");
    } else {
      toast.error("Not logged in");
      return;
    }
  };

  // Listening
  useEffect(() => {
    const messages = gun.get(userAddress);
    console.log("listening on topic -> " + userAddress);
    messages.map().on((...props) => {
      const m = props[0];
      addMessages(m);
    });

    return () => {
      messages.off();
    };
  }, [userAddress, addMessages]);

  return (
    <div className="mt-5 w-2/3">
      <div className="mt-4 flex flex-row items-stretch">
        <button
          type="button"
          onClick={saveMessage}
          className="border-[3px] border-yellow-500 bg-yellow-300 p-4 rounded-lg text-black w-60 h-[70px] text-lg"
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
          className="ml-5 p-5 text-black rounded-lg h-[70px] flex-1"
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

            if (message && message.name === recieverAddress) {
              return (
                <div className="flex flex-row justify-start">
                  <div className="w-4/5 bg-white p-5 my-3 rounded-xl border-gray-300 border-r-4 border-b-4">
                    <div className="text-base text-gray-500 mb-2">
                      {message.name}
                    </div>
                    <div className="mb-4 text-xl ml-3 text-black">
                      {decryptedMessage}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="flex flex-row justify-end">
                <div className="w-4/5 bg-white p-5 pb-2 my-3 rounded-xl border-gray-300 border-r-4 border-b-4">
                  <div className="text-base text-gray-500 mb-2">
                    {message.name}
                  </div>
                  <div className="mb-6 text-xl ml-3 text-black">
                    {decryptedMessage}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Chat;
