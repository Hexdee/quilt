import React, { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Moralis from "./moralis";
import { ethers } from "ethers";
import Wallet from "./wallet";
import Gun from "gun";
import Chat from "./chat";
require("gun/sea");

// initialize gun locally
const gun = Gun({
  peers: [
    "http://localhost:3030/gun",
    "https://gun-manhattan.herokuapp.com/gun",
  ],
});

const Auth = (props) => {
  const walletAddress = props.wallet;

  //Database
  let client = gun.user();

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const signUp = () => {
    client.create(walletAddress, pass, alert("User signed up successfully!"));
    //  client.get(walletAddress).put({username:"username"});
    console.log(walletAddress);
  };

  const signIn = () => {
    client.auth(
      walletAddress,
      pass,
      alert("Sign in successful!"),
      ({ err }) => err && alert(err)
    );
    console.log(walletAddress);
  };

  //Gun User
  client = gun.user().recall({ sessionStorage: true });

  return (
    <div style={{ padding: 30 }}>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">username</label>
          <input
            type="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            id="username"
            aria-describedby="emailHelp"
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            id="pass"
            placeholder="Password"
          />
        </div>

        <button
          id="in"
          type="button"
          className="btn btn-primary"
          onClick={signIn}
        >
          Sign in
        </button>
        <button
          id="up"
          type="button"
          className="btn btn-primary"
          onClick={signUp}
        >
          Sign up
        </button>
      </form>
      <div>
        <Chat wallet={walletAddress} user={client} />
      </div>
    </div>
  );
};

export default Auth;
