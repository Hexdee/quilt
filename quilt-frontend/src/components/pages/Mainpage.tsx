import React, { useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { toast } from "react-toastify";
import { BigNumber } from "ethers";
import BN from "bn.js";

import { useGunAccount } from "../../stores/useGunAccount";
import { useEncryption } from "../../stores/useEncryption";
import { useContracts } from "../../stores/useContracts";
import { useMessages } from "../../stores/useMessages";
import { useProvider } from "../../stores/useProvider";
import { useUserData } from "../../stores/useUserData";

import { storePrivateKey } from "../../scripts/storage/storeAccount";
import { FriendListItem } from "../FriendListItem";
import { Auth } from "../chat/Auth";

interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = ({}) => {
  const [friendInput, setFriendInput] = useState<string>("");
  const provider = useProvider((state) => state.provider);
  const address = useUserData((state) => state.address);
  const isGunLogged = useGunAccount((state) => state.isLogged);

  const setPrivateKey = useEncryption((state) => state.setPrivateKey);
  const privateKey = useEncryption((state) => state.privateKey);
  const encryptor = useEncryption((state) => state.encryptor);
  const curve = useEncryption((state) => state.curve);

  const friendList = useMessages((state) => Array.from(state.friendList));
  const addFriend = useMessages((state) => state.addFriend);
  const removeFriend = useMessages((state) => state.removeFriend);
  const setRecieverAddress = useMessages((state) => state.setRecieverAddress);

  const keyStorage = useContracts((state) => state.contract);
  const contract = useContracts((state) => state.contract);

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
            friendList.map((element) => (
              <FriendListItem
                key={element}
                address={element}
                handleRemoveFriend={handleRemoveFriend}
                handleSetFriend={handleSetFriend}
              ></FriendListItem>
            ))}
        </div>
      </div>
      <div className="w-2/3 ml-10">
        {isGunLogged && !privateKey && (
          <button
            onClick={() => generateKeyPair()}
            className="bg-gradient-to-bl from-sky-600 to-blue-700 p-4 text-white h-[70px] text-lg w-2/3 block"
          >
            Generate new private key
          </button>
        )}
        <Auth wallet={address}></Auth>
      </div>
    </div>
  );
};
