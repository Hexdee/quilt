import { useEffect, useState } from "react";
import Gun from "gun";
import Chat from "./chat";
import { toast } from "react-toastify";
import { useGunAccount } from "../../stores/useGunAccount";
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

  const signUp = () => {
    client.create(walletAddress, pass, ({ err }) => {
      if (err) {
        toast.error(err, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Successfully signed up", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  const signIn = () => {
    client.auth(walletAddress, pass, ({ err }) => {
      if (err) {
        toast.error(err, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setGunLogged(true);
        setGunUsername(walletAddress);
        toast.success("Sign in successful!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
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
              className="text-xl block mb-2 ml-3"
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
                className="border-[3px] border-yellow-500 bg-yellow-300 p-4 rounded-lg text-black h-16 text-lg mr-2 w-full"
              >
                Sign in
              </button>
              <button
                id="up"
                type="button"
                onClick={signUp}
                className="border-[3px] border-yellow-500 bg-yellow-300 p-4 rounded-lg text-black h-16 text-lg ml-2 w-full"
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
