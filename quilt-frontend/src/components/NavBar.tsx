import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useProvider } from "../stores/useProvider";
import { useUserData } from "../stores/useUserData";
import { LoadableButton } from "./base/LoadableButton";
import Logo from "../assets/quilt.png";
import { toast } from "react-toastify";
import { networks } from "../constants/networks";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const login = useUserData((state) => state.login);
  const logout = useUserData((state) => state.logout);
  const isLogged = useUserData((state) => state.isLogged);

  const address = useUserData((state) => state.address);
  const setProvider = useProvider((state) => state.setProvider);
  const setBalance = useUserData((state) => state.setBalance);

  const handleConnectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (!window.ethereum) throw new Error("Cannot find MetaMask");

      // Switch networks
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks["fuji"],
          },
        ],
      });

      // Set up wallet
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      if (!signer) return new Error("Metamask is not connected");

      login(address);
      setBalance((await provider.getSigner().getBalance()).toString());
      setProvider(provider);
      setIsConnecting(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsConnecting(false);
    }
  }, [login, setProvider, setBalance]);

  useEffect(() => {
    handleConnectWallet();
  }, [handleConnectWallet]);

  const handleDisconnectWallet = () => {
    logout();
  };

  return (
    <div className="h-[12vh] w-full flex flex-row justify-center border-b border-gray-700">
      <div className="w-5/6  flex flex-row justify-between align-middle items-center">
        <NavLink className="logo-button" to="/">
          <img src={Logo} alt="" className="w-32" />
        </NavLink>
        <div className="flex flex-row">
          {isLogged ? (
            <>
              <LoadableButton
                isLoading={false}
                description="disconnect"
                handleClick={() => handleDisconnectWallet()}
                className="bg-gradient-to-bl from-sky-600 to-blue-700 text-white p-4 rounded-lg w-60 h-16 m-2 text-lg mr-4"
              />
              <LoadableButton
                isLoading={false}
                description={`${address.substring(0, 16)}...`}
                className="border-2 border-sky-600 p-4 rounded-lg text-white w-60 h-16 m-2 text-xl hover:scale-95 transition-all duration-75"
                navigate="/profile"
              />
            </>
          ) : (
            <LoadableButton
              isLoading={isConnecting}
              description="connect wallet"
              handleClick={() => handleConnectWallet()}
              className="bg-gradient-to-bl from-sky-600 to-blue-700 p-4 rounded-lg text-white w-60 h-16 m-2 text-lg mr-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};
