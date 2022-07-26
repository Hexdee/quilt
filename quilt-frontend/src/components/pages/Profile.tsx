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
import Sidebar from "../Sidebar";
import defaultAvatar from "../../assets/avatar.png";
import {ethers} from "ethers";

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = () => {
  const [Avatar, setAvatar] = useState<string>("");
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);
  const [NFTContract, setNFTContract] = useState<string>("");
  const [tokenID, setTokenID] = useState<number>(0);
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

  const editAvatar = async () => {
    if (!(NFTContract)) {
    	toast.error("Enter NFT details!");
    }
    try {
    	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const nftabi = ["function tokenURI(uint) view returns (string)"];
	const nftContract = new ethers.Contract(NFTContract, nftabi, provider);
	let url = await nftContract.tokenURI(tokenID);
	if (url.slice(0, 4) == "ipfs") {
	  url = url.slice(7);
	  url = "https://ipfs.io/ipfs/" + url;
	}
	const response = await fetch(url);
	const metadata: any  = await response.json()
        let image = metadata.image;
	if (image.slice(0, 4) == "ipfs") {
	  image = image.slice(7);
          image = "https://ipfs.io/ipfs/" + image;
	}
	console.log(image);
	changeAvatar(image);
	setAvatar(image);
	console.log(getAvatar());
	setIsEditingAvatar(false);
    } catch (error: any) {
      if (error instanceof Error) {
        setIsEditingAvatar(true);
        console.log(error);
	toast.error("Failed to get token image");
      }
    }
  }

  const changeAvatar = async(url: string) => {
    try {                                                             const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profileAddress = "0x7eEa82C6cEEfB6423Afae369dC8A2e612f9AD1F4";
        const profileABI = ["function setProfile(address, string)"];
        const profile = new ethers.Contract(profileAddress, profileABI, signer);
        await profile.setProfile(signer.getAddress(), url);
    } catch (error: any) {
      if (error instanceof Error) {
	  console.log(error);
	  toast.error("Failed to set avatar");
      }
    }
  }

  const getAvatar = async() => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
	const profileAddress = "0x7eEa82C6cEEfB6423Afae369dC8A2e612f9AD1F4";
        const profileABI = ["function getProfile(address) view returns(string)"];
        const profile = new ethers.Contract(profileAddress, profileABI, provider);
	const image = await profile.getProfile(signer.getAddress());
	setAvatar(image)
    } catch (error: any) {
        if (error instanceof Error) {
	    console.log(error);
	    toast.error("Failed to get avatar");
	}
    }
  }

  useEffect(() => {
    getAvatar();
    }, [])

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
    <div className="relative flex h-[82vh] flex-row justify-center">
      <Sidebar />

      <div className="dapp-bg dapp-content w-full">
        <div className="flex-column w-4/8 mb-4 items-center items-center justify-center">
          <div className="profile-change">
            <div className="avatar p-20">
              <div className="avatar-img">
                <a href={Avatar}>
		  <img src={Avatar || defaultAvatar} />
		</a>
              </div>
              <div className="edit-avatar ml-10">
                <span className="" onClick={()=>setIsEditingAvatar(true)}>Edit Avatar</span>
              </div>
            </div>
	   {isEditingAvatar && <>
	    <div className="username">
	      <span>NFT Contract</span>
	        <input
	          id="nft-contract"
	          onChange={(e) => {
	            setNFTContract(e.target.value);
	          }}
	          placeholder=""
                  name="nft-contract"
		  className="input-username w-4/5"
		/>
            </div>
	    <div className="username">
	      <span>Token ID</span>
	        <input
		  type="number"
		  id="token-id"
		  onChange={(e) => {
		    setTokenID(Number(e.target.value));
		  }}
		  placeholder=""
		  name="token-id"
		  className="input-username w-4/5"
                />
	    </div>
	    <button
	      onClick={editAvatar}
	      className="secondary-button w-32 mx-auto"
	    >
	      Submit
	    </button>
	    <br/>
	    <br/>
	    </>}
            <div className="username">
              <span>Nickname</span>
              <input
                id="nickname"
                onChange={(e) => {
                  setFriendInput(e.target.value);
                }}
                placeholder=""
                name="nickname"
                // value={nickname}
                className="input-username w-4/5"
              />
            </div>

            <div className="bio-desc mt-10">
              <span>Bio</span>

              <textarea className="input-profile w-4/5"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
