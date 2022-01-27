import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import Auth from "../../scripts/chat/auth";
import Moralis from "../../scripts/chat/moralis";
import { useContracts } from "../../stores/useContracts";
import { useEncryption } from "../../stores/useEncryption";
import { useMessages } from "../../stores/useMessages";
import { useProvider } from "../../stores/useProvider";
import { useUserData } from "../../stores/useUserData";
import { useGunAccount } from "../../stores/useGunAccount";
import { storePrivateKey } from "../../scripts/storage/storeAccount";
import { toast } from "react-toastify";
import BN from "bn.js";

interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = ({}) => {
  const privateKey = useEncryption((state) => state.privateKey);
  const setPrivateKey = useEncryption((state) => state.setPrivateKey);
  const [publicX, setPublicX] = useState<String>("");
  const [publicY, setPublicY] = useState<String>("");
  const [friendInput, setFriendInput] = useState<string>("");
  const keyStorage = useContracts((state) => state.contract);
  const provider = useProvider((state) => state.provider);
  const address = useUserData((state) => state.address);
  const curve = useEncryption((state) => state.curve);
  const friendList = useMessages((state) => Array.from(state.friendList));
  const addFriend = useMessages((state) => state.addFriend);
  const removeFriend = useMessages((state) => state.removeFriend);
  const setRecieverAddress = useMessages((state) => state.setRecieverAddress);
  const contract = useContracts((state) => state.contract);
  const encryptor = useEncryption((state) => state.encryptor);
  const isGunLogged = useGunAccount((state) => state.isLogged);

  const generateKeyPair = async () => {
    try {
      if (!curve) throw new Error("Encryption initialization failed");
      if (!(keyStorage && provider))
        throw new Error("Failed to connect with contract");

      const [privateKey, publicKey] = curve.makeKeyPair();

      if (!publicKey) return;

      await keyStorage.setUserKey(
        BigNumber.from(publicKey.x.toString(10)),
        BigNumber.from(publicKey.y.toString(10))
      );

      setPrivateKey(privateKey.toString(10));
      storePrivateKey(privateKey.toString(10));
      setPublicX(publicKey.x.toString(10));
      setPublicY(publicKey.y.toString(10));

      toast.success("Successfully generated a new key");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!(keyStorage && provider)) {
      return;
    }

    keyStorage.on("KeyPublished", (...args: any[]) => {
      console.log("new public key was published");
      console.log(args);
    });

    return () => {
      keyStorage.removeAllListeners();
    };
  }, [keyStorage, provider]);

  const handleAddFriend = () => {
    toast.info(`Added new friend: ${friendInput}`);

    addFriend(friendInput);
    setFriendInput("");
  };

  const handleRemoveFriend = (address: string) => {
    toast.info(`Removed a friend: ${address}`);
    console.log(address);
    removeFriend(address);
  };

  const handleSetFriend = async (address: string) => {
    try {
      if (!privateKey) {
        throw new Error("Private key is not generated");
      }

      if (!(curve && contract && encryptor))
        throw new Error("Try restarting application");

      setRecieverAddress(address);
      const targetUserPublicKey = await contract.getUserKey(address);

      if (targetUserPublicKey.x.isZero()) {
        throw new Error("User doesn't have an account");
      }
      console.log(
        `fetched public key X -> ${targetUserPublicKey.x.toString()}`
      );
      console.log(
        `fetched public key X -> ${targetUserPublicKey.y.toString()}`
      );

      const targetUserPublicKeyTrans = {
        x: new BN(targetUserPublicKey.x.toString(), 10),
        y: new BN(targetUserPublicKey.y.toString(), 10),
      };

      const sharedSecret = curve.generateSharedSecret(
        new BN(privateKey, 10),
        targetUserPublicKeyTrans
      );
      console.log(`generated shared key -> ${sharedSecret.toString()}`);
      encryptor.setSharedSecret(address, sharedSecret.toString());

      toast.success("Successfully connected");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-row justify-start mt-12">
      <div className="w-1/4 px-5">
        <div className="text-2xl text-white mb-2">Friends</div>
        <div className="flex flex-row items-center mb-6">
          <input
            id="friend"
            onChange={(e) => {
              setFriendInput(e.target.value);
            }}
            placeholder="Reciever address"
            name="address"
            value={friendInput}
            className="p-5 w-96 h-16 text-black rounded-lg"
          />
          <button
            onClick={() => handleAddFriend()}
            className="border-[3px] border-yellow-500 bg-yellow-300 p-4 rounded-lg text-black flex-1 h-16 ml-2 text-lg"
          >
            Add
          </button>
        </div>
        <div>
          {friendList &&
            friendList.map((element: any) => {
              return (
                <div
                  className="w-full bg-white rounded-lg h-16 text-black flex flex-row justify-between items-center text-xl my-2 cursor-pointer hover:scale-105 transition-all duration-100"
                  onClick={() => handleSetFriend(element)}
                >
                  <div className="ml-5 overflow-hidden">{`${element.substring(
                    0,
                    25
                  )}...`}</div>
                  <div>
                    <button
                      onClick={() => handleRemoveFriend(element)}
                      className="bg-red-500 w-24 h-12 mr-3 rounded-md font-bold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-2/3 ml-10">
        {isGunLogged && (
          <div className="mt-10">
            <button
              onClick={() => generateKeyPair()}
              className="border-[3px] border-yellow-500 bg-yellow-300 p-4 rounded-lg text-black h-[70px] text-lg w-60"
            >
              Generate new private key
            </button>
            <div className="text-xl">
              <Moralis></Moralis>
            </div>
          </div>
        )}
        <div className="text-xl">
          <Auth wallet={address}></Auth>
        </div>
      </div>
    </div>
  );
};
