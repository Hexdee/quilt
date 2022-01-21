import React, { useState } from "react";
require("gun/sea");

const Chat = (props) => {
  const walletAddress = props.wallet;
  const user = props.user;
  const [message, setMessage] = useState("");

  const saveMessage = () => {
    if (user.is) {
      alert("sent");
      setMessage("");
    } else {
      alert("Not logged in");
      setMessage("");
      return;
    }
  };
  return (
    <div style={{ padding: 30 }}>
      <input
        id="message"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Message"
        name="message"
        value={message}
      />
      <button type="button" onClick={saveMessage}>
        Send Message
      </button>
    </div>
  );
};

export default Chat;
