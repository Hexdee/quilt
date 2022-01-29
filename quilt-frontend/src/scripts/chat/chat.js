import { useState, useEffect } from "react";
import Gun from "gun";
import { useMessages } from "../../stores/useMessages";
import { useUserData } from "../../stores/useUserData";
import { useEncryption } from "../../stores/useEncryption";
import { toast } from "react-toastify";
import { IoSend } from "react-icons/io5";
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
  const privateKey = useEncryption((state) => state.privateKey);

  // Sending messages
  const saveMessage = () => {
    if (!privateKey)
      return toast.error("Generate a private key before sending the message.");

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

  // Listening on user messages
  useEffect(() => {
    if (!recieverAddress) return;

    const messages = gun.get(recieverAddress);
    console.log("listening for user messages on topic -> " + recieverAddress);
    messages.map().on((...props) => {
      const m = props[0];

      if (props[0].name === userAddress) {
        console.log("adding user message");
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
          onClick={saveMessage}
          className="bg-gradient-to-bl from-sky-600 to-blue-700 text-white p-4 rounded-xl w-24 h-[70px] text-lg flex items-center justify-center transition-all hover:border-4 duration-200"
        >
          <IoSend></IoSend>
        </button>
      </div>
    </div>
  );
};

export default Chat;
