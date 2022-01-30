import { useState } from "react";
import Gun from "gun";
import Chat from "./chat";
import { toast } from "react-toastify";
import { useGunAccount } from "../../stores/useGunAccount";
import { readUsername, storeUsername } from "../storage/storeAccount";
require("gun/sea");

// initialize gun locally
const gun = Gun({
  peers: ["https://quilt-chat.herokuapp.com/gun"],
});

const Auth = (props) => {
  const walletAddress = props.wallet;
  const isGunLogged = useGunAccount((state) => state.isLogged);
  const setGunLogged = useGunAccount((state) => state.setIsLogged);
  const setGunUsername = useGunAccount((state) => state.setUsername);

  //Database
  let client = gun.user();
  const [pass, setPass] = useState("");

  const genRanHex = (size) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

  const signUp = () => {
    const generatedUsername = genRanHex(30);

    client.create(generatedUsername, pass, ({ err }) => {
      if (err) return toast.error(err);

      storeUsername(generatedUsername);
      setGunUsername(generatedUsername);
      toast.success("Successfully signed up!");
    });
  };

  const signIn = () => {
    const username = readUsername();
    if (!username) return toast.error("Please create your account");

    client.auth(username, pass, ({ err }) => {
      if (err) return toast.error(err);

      setGunLogged(true);
      storeUsername(username);
      setGunUsername(username);
      toast.success("Sign in successful!");
    });
  };

  //Gun User
  client = gun.user().recall({ sessionStorage: true });

  return (
    <div>
      {isGunLogged ? (
        <div>
          <Chat wallet={walletAddress} user={client} />
        </div>
      ) : (
        <form>
          <div className="form-group flex flex-col w-2/3">
            <label
              htmlFor="exampleInputPassword1"
              className="text-xl block mb-2 ml-3 pt-7"
            >
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
              className="p-5 text-black rounded-lg"
            />
            <div className="mt-4 flex flex-row items-stretch">
              <button
                id="in"
                type="button"
                onClick={signIn}
                className="bg-gradient-to-bl from-sky-600 to-blue-700 text-white p-4 rounded-lg h-16 text-lg mr-2 w-full"
              >
                Sign in
              </button>
              <button
                id="up"
                type="button"
                onClick={signUp}
                className="bg-gradient-to-tl to-sky-600 from-blue-700 text-white p-4 rounded-lg h-16 text-lg ml-2 w-full"
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Auth;
