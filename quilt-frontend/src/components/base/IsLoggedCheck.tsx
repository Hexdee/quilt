import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { useUserData } from "../../stores/useUserData";
import { LoadableButton } from "./LoadableButton";

import Logo from "../assets/logo.svg";
import { trimEthereumAddress } from "../../helpers/trimEthereumAddress";
import { useWallet } from "../../hooks/useWallet";
import { RiLogoutBoxLine } from "react-icons/ri";

interface IsLoggedCheckProps {}

export const IsLoggedCheck: React.FC<IsLoggedCheckProps> = () => {
  const isLogged = useUserData((state) => state.isLogged);
  const address = useUserData((state) => state.address);
  const [isConnecting, connectWallet, disconnectWallet] = useWallet();

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div className="flex h-[11vh] w-full flex-row justify-center">
      <div className="flex  w-5/6 flex-row items-center justify-between align-middle">
        <div className="flex flex-row">
          {isLogged ? (
            <>
              <LoadableButton
                isLoading={false}
                description={trimEthereumAddress(address, 16)}
                className="connectWallet-btn m-2 p-4 text-xl transition-all duration-75 hover:scale-95"
                navigate="/settings/profile"
              />
              <LoadableButton
                isLoading={false}
                handleClick={disconnectWallet}
                className="connectWallet-btn m-2 mr-4 items-center justify-center p-4 text-lg"
              >
                <RiLogoutBoxLine />
              </LoadableButton>
            </>
          ) : (
            <LoadableButton
              isLoading={isConnecting}
              description="connect wallet"
              handleClick={connectWallet}
              className="connectWallet-btn m-2 mr-4 items-center  justify-center p-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};
