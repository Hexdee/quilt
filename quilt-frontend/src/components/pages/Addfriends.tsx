import React, { useCallback, useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { toast } from "react-toastify";
import BN from "bn.js";

import { useGunAccount } from "../../stores/useGunAccount";
import { useEncryption } from "../../stores/useEncryption";
import { useContracts } from "../../stores/useContracts";
import { useMessages } from "../../stores/useMessages";
import { useProvider } from "../../stores/useProvider";
import { useFriendsList } from "../../stores/useFriendsList";

import { storeFriendsList } from "../../modules/storage/storeFriendsList";
import { FriendListItem } from "../FriendListItem";
import { useMessagesRequests } from "../../stores/useMessagesRequests";
import { RequestListItem } from "../RequestListItem";
import { trimEthereumAddress } from "../../helpers/trimEthereumAddress";
import { KeyStorage } from "../../ABI/typechain/KeyStorage";
import NavMenu from "../base/NavMenu";

interface AddFriendsProps {}

export const AddFriends: React.FC<AddFriendsProps> = () => {
  const [friendInput, setFriendInput] = useState<string>("");
  const [isGeneratingSharedKey, setIsGeneratingSharedKey] =
    useState<boolean>(false);
  const provider = useProvider((state) => state.provider);
  const isGunLogged = useGunAccount((state) => state.isLogged);

  const privateKey = useEncryption((state) => state.privateKey);
  const encryptor = useEncryption((state) => state.encryptor);
  const curve = useEncryption((state) => state.curve);

  const initializedFriendsList = useFriendsList((state) => state.initialized);
  const friends = useFriendsList((state) => state.friends);
  const addFriend = useFriendsList((state) => state.addFriend);
  const removeFriend = useFriendsList((state) => state.removeFriend);
  const setRecieverAddress = useMessages((state) => state.setRecieverAddress);

  const requests = useMessagesRequests((state) => state.requestList);

  const keyStorage = useContracts((state) => state.contract);
  const contract = useContracts((state) => state.contract);

  const fetchPublicKey = useCallback(
    async (contract: KeyStorage, address: string): Promise<string> => {
      const targetUserPublicKey = await contract.getUserKey(address);

      if (targetUserPublicKey.x.isZero()) {
        throw new Error("User doesn't have an account");
      }

      const targetUserPublicKeyTransformed = {
        x: new BN(targetUserPublicKey.x.toString(), 10),
        y: new BN(targetUserPublicKey.y.toString(), 10),
      };

      const sharedSecret = curve.generateSharedSecret(
        new BN(privateKey, 10),
        targetUserPublicKeyTransformed
      );

      return sharedSecret.toString();
    },
    [curve, privateKey]
  );

  const handleAddFriend = useCallback(() => {
    toast.info(`Added new friend: ${friendInput}`);

    addFriend(friendInput.replace(/\s/g, ""), { username: "" });
    setFriendInput("");
  }, [addFriend, setFriendInput, friendInput]);

  const handleRemoveFriend = useCallback(
    (address: string) => {
      toast.info(`Removed a friend: ${address}`);
      removeFriend(address);
    },
    [removeFriend]
  );

  const handleSetFriend = async (friendAddress: string) => {
    setIsGeneratingSharedKey(true);
    try {
      if (!privateKey) {
        throw new Error("Private key is not generated");
      }

      if (!(curve && contract && encryptor))
        throw new Error("Try restarting application");

      setRecieverAddress(friendAddress);

      const sharedSecret = await fetchPublicKey(contract, friendAddress);

      encryptor.setSharedSecret(friendAddress, sharedSecret);
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error);
        toast.error("Failed to get public key");
      }
    }
    setIsGeneratingSharedKey(false);
  };

  useEffect(() => {
    if (!(keyStorage && provider)) {
      return;
    }

    keyStorage.on("KeyPublished", async (publisher: string) => {
      if (!friends[publisher]) return;
      if (!contract) return;

      toast.info(
        `${trimEthereumAddress(publisher, 15)} changed his public key`
      );

      try {
        const sharedSecret = await fetchPublicKey(contract, publisher);

        encryptor.setSharedSecret(publisher, sharedSecret);
        toast.success("Successfully updated friends public key");
      } catch (error: any) {
        if (error instanceof Error) {
          console.log(error);
          toast.error("Failed to update friends public key");
        }
      }
    });

    return () => {
      keyStorage.removeAllListeners();
    };
  }, [keyStorage, provider, friends, contract, fetchPublicKey, encryptor]);

  useEffect(() => {
    if (!Object.keys(friends).length && !initializedFriendsList) return;

    storeFriendsList(friends);
  }, [friends, initializedFriendsList]);

  return (
    <div className="flex dapp-bg flex-row justify-start h-[82vh] relative">
        <NavMenu />
      <div className="w-1/4 px-5 flex flex-col">
        {/* <div className="text-2xl text-white mb-2 pt-6">Friends</div> */}
        <div className="text-2xl text-white mb-2 pt-6">Fill in your friend's wallet address</div>

        <div className="flex-column items-center mb-4 items-center justify-center">
          <input
            id="friend"
            onChange={(e) => {
              setFriendInput(e.target.value);
            }}
            placeholder="Receiver address"
            name="address"
            value={friendInput}
            className="p-5 w-4/5 input-friends"
          />
          <br />

          <button
            onClick={() => handleAddFriend()}
            className="secondary-button p-4 items-center  flex-1 ali ml-2 mt-4 "
          >
          Add Friend
          </button>
        </div>
        <div>
          {friends &&
            Object.keys(friends).map((element) => (
              <FriendListItem
                key={element}
                address={element}
                handleRemoveFriend={handleRemoveFriend}
                handleSetFriend={handleSetFriend}
              ></FriendListItem>
            ))}
        </div>
        <div className="text-2xl text-white mb-2 pt-6">Requests</div>
        <div className="overflow-y-scroll scrollbar-hide flex-1">
          {requests &&
            Array.from(requests).map((element) => (
              <RequestListItem
                key={element}
                address={element}
                handleSetFriend={handleSetFriend}
              ></RequestListItem>
            ))}
        </div>
      </div>

    </div>
  );
};
