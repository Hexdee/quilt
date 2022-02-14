import { useState } from "react";
import Gun from "gun";
import { Chat } from "./Chat";
import { toast } from "react-toastify";
import { useGunAccount } from "../../stores/useGunAccount";
import {
  readUsername,
  storeUsername,
} from "../../scripts/storage/storeAccount";
import { gunDbAddress } from "../../constants/gundb";
import { generateRandomHex } from "../../scripts/randomizaiton/generateRandom";
require("gun/sea");

// initialize gun
const gun = Gun({
  peers: [gunDbAddress],
});

interface AuthProps {
  wallet: string;
}

export const Auth: React.FC<AuthProps> = ({ wallet: walletAddress }) => {
  const isGunLogged = useGunAccount((state) => state.isLogged);
  const setGunLogged = useGunAccount((state) => state.setIsLogged);
  const setGunUsername = useGunAccount((state) => state.setUsername);
  const [pass, setPass] = useState("");

  let client = gun.user().recall({ sessionStorage: true });

  const register = () => {
    const generatedUsername = generateRandomHex(30);

    // TODO: solve this TS error. Not sure how to handle this union
    client.create(generatedUsername, pass, (args: any) => {
      if (args.err) return toast.error(args.err);

      storeUsername(generatedUsername);
      setGunUsername(generatedUsername);
      toast.success("Successfully signed up!");
    });
  };

  const login = () => {
    const username = readUsername();
    if (!username) return toast.error("Please create your account");

    // TODO: solve this TS error. Not sure how to handle this union
    client.auth(username, pass, (args: any) => {
      if (args.err) return toast.error(args.err);

      setGunLogged(true);
      storeUsername(username);
      setGunUsername(username);
      toast.success("Signed in successfully!");
    });
  };

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
                onClick={login}
                className="bg-gradient-to-bl from-sky-600 to-blue-700 text-white p-4 rounded-lg h-16 text-lg mr-2 w-full"
              >
                Sign in
              </button>
              <button
                id="up"
                type="button"
                onClick={register}
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
