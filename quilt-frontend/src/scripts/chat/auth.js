import { useState } from "react";
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
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1" className="mt-10 text-xl">
            Password
          </label>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            id="pass"
            placeholder="Password"
            className="ml-5 p-5 w-96 text-black rounded-lg"
          />
        </div>

        <div className="mt-2">
          <button
            id="in"
            type="button"
            onClick={signIn}
            className="border-2 border-yellow-500 bg-yellow-300 p-4 rounded-2xl text-black w-60 h-16 m-2 inline-block"
          >
            Sign in
          </button>
          <button
            id="up"
            type="button"
            onClick={signUp}
            className="border-2 border-yellow-500 bg-yellow-300 p-4 rounded-2xl text-black w-60 h-16 m-2 inline-block"
          >
            Sign up
          </button>
        </div>
      </form>
      <div>
        <Chat wallet={walletAddress} user={client} />
      </div>
    </div>
  );
};

export default Auth;
