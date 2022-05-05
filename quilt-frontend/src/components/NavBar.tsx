import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useUserData } from "../stores/useUserData";
import { LoadableButton } from "./base/LoadableButton";

import Logo from "../assets/logo.svg";
import { trimEthereumAddress } from "../helpers/trimEthereumAddress";
import { useWallet } from "../hooks/useWallet";
import { RiLogoutBoxLine } from "react-icons/ri";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const isLogged = useUserData((state) => state.isLogged);
  const address = useUserData((state) => state.address);
  const [isConnecting, connectWallet, disconnectWallet] = useWallet();

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div className="h-[11vh] w-full flex flex-row justify-center">
      <div className="w-5/6  flex flex-row justify-between align-middle items-center">
        <NavLink className="logo-button" to="/">
          <img src={Logo} alt="logo" className="w-28" />
        </NavLink>
        <div className="flex flex-row">
          {isLogged ? (
            <>
              <LoadableButton
                isLoading={false}
                description={trimEthereumAddress(address, 16)}
                className="connectWallet-btn p-4 m-2 text-xl hover:scale-95 transition-all duration-75"
                navigate="/settings/profile"
              />
              <LoadableButton
                isLoading={false}
                handleClick={disconnectWallet}
                className="connectWallet-btn p-4 m-2 text-lg mr-4 items-center justify-center"
              >
                <RiLogoutBoxLine />
              </LoadableButton>
            </>
          ) : (
            <LoadableButton
              isLoading={isConnecting}
              description="connect wallet"
              handleClick={connectWallet}
              className="connectWallet-btn p-4 items-center justify-center  m-2 mr-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};
