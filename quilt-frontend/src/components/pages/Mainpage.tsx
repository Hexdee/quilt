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
import { FaRegTrashAlt } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";

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

      if (!publicKey || !privateKey) return;

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

    addFriend(friendInput.replace(/\s/g, ""));
    setFriendInput("");
  };

  const handleRemoveFriend = (address: string) => {
    toast.info(`Removed a friend: ${address}`);
    removeFriend(address);
  };

  const handleSetFriend = async (friendAddress: string) => {
    try {
      if (!privateKey) {
        throw new Error("Private key is not generated");
      }

      if (!(curve && contract && encryptor))
        throw new Error("Try restarting application");

      setRecieverAddress(friendAddress);
      const targetUserPublicKey = await contract.getUserKey(friendAddress);

      if (targetUserPublicKey.x.isZero()) {
        throw new Error("User doesn't have an account");
      }

      const targetUserPublicKeyTrans = {
        x: new BN(targetUserPublicKey.x.toString(), 10),
        y: new BN(targetUserPublicKey.y.toString(), 10),
      };

      const sharedSecret = curve.generateSharedSecret(
        new BN(privateKey, 10),
        targetUserPublicKeyTrans
      );

      encryptor.setSharedSecret(friendAddress, sharedSecret.toString());
      toast.success("Successfully connected");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-row justify-start h-[82vh] relative">
      <div className="w-1/4 px-5">
        <div className="text-2xl text-white mb-2 pt-6">Friends</div>
        <div className="flex flex-row items-center mb-4">
          <input
            id="friend"
            onChange={(e) => {
              setFriendInput(e.target.value);
            }}
            placeholder="Reciever address"
            name="address"
            value={friendInput}
            className="p-5 w-4/5 h-16 text-black rounded-lg"
          />
          <button
            onClick={() => handleAddFriend()}
            className="bg-gradient-to-bl from-sky-600 to-blue-700 text-white p-4 rounded-lg flex-1 h-16 w-16 ml-2 text-lg flex items-center justify-center"
          >
            <IoPersonAdd></IoPersonAdd>
          </button>
        </div>
        <div>
          {friendList &&
            friendList.map((element: any) => {
              return (
                <div
                  className="w-full rounded-lg h-20 text-white flex flex-row justify-between items-center text-xl my-2 px-4 cursor-pointer hover:scale-105 border border-gray-800"
                  onClick={() => handleSetFriend(element)}
                >
                  <div className="h-12 w-12 rounded-full bg-slate-800"></div>
                  <div className="overflow-hidden">{`${element.substring(
                    0,
                    22
                  )}...`}</div>
                  <div>
                    <button
                      onClick={() => handleRemoveFriend(element)}
                      className="bg-red-500 w-12 h-12 rounded-md font-bold text-sm flex items-center justify-center"
                    >
                      <FaRegTrashAlt></FaRegTrashAlt>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-2/3 ml-10">
        {isGunLogged && (
          <div>
            {!privateKey && (
              <button
                onClick={() => generateKeyPair()}
                className="bg-gradient-to-bl from-sky-600 to-blue-700 p-4 text-white h-[70px] text-lg w-2/3"
              >
                Generate new private key
              </button>
            )}
            <div className="text-xl">
              <Moralis></Moralis>
            </div>
          </div>
        )}
        <Auth wallet={address}></Auth>
      </div>
    </div>
  );
};
