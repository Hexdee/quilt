import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useProvider } from "../stores/useProvider";
import { useUserData } from "../stores/useUserData";
import { LoadableButton } from "./base/LoadableButton";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [error, setError] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const login = useUserData((state) => state.login);
  const logout = useUserData((state) => state.logout);
  const isLogged = useUserData((state) => state.isLogged);

  const address = useUserData((state) => state.address);
  const setProvider = useProvider((state) => state.setProvider);
  const setBalance = useUserData((state) => state.setBalance);

  const handleConnectWallet = useCallback(async () => {
    try {
      console.log("handleConnectWallet");
      setIsConnecting(true);
      if (!window.ethereum) throw new Error("Cannot find MetaMask");

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      console.log(provider);

      if (!signer) return setError("Metamask is not connected");

      login(address);
      setBalance((await provider.getSigner().getBalance()).toString());
      setProvider(provider);
      setIsConnecting(false);
      console.log("handleConnectWallet");
    } catch (error: any) {
      console.log(error.message);
      setIsConnecting(false);
      setError(error.message);
    }
  }, [login, setProvider, setBalance]);

  useEffect(() => {
    handleConnectWallet();
  }, [handleConnectWallet]);

  const handleDisconnectWallet = () => {
    logout();
  };

  return (
    <div className="h-28 w-full flex flex-row justify-center bg-gray-900">
      <div className="w-11/12  flex flex-row justify-between align-middle items-center">
        <NavLink className="logo-button" to="/">
          <div className="w-12 h-12"></div>
        </NavLink>
        <div className="flex flex-row">
          {isLogged ? (
            <>
              <LoadableButton
                isLoading={false}
                description="disconnect"
                handleClick={() => handleDisconnectWallet()}
                className="mr-6 cursor-pointer w-48 h-14 bg-blue-600 transform hover:bg-blue-500 hover:scale-105 transition-all duration-75 rounded-lg text-white flex justify-center flex-col text-xl border-blue-800 border-r-4 border-b-4"
              />
              <LoadableButton
                isLoading={false}
                description={`${address.substring(0, 16)}...`}
                className="w-60 h-14 cursor-pointer bg-transparent transform hover:bg-blue-600 hover:scale-105 transition-all duration-75 rounded-lg text-white flex justify-center flex-col text-xl border-blue-600 border-2"
                navigate="/profile"
              />
            </>
          ) : (
            <LoadableButton
              isLoading={isConnecting}
              description="connect wallet"
              handleClick={() => handleConnectWallet()}
              alertMessage={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};
