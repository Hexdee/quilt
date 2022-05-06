import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
import { IoPersonAdd } from "react-icons/io5";
import { toast } from "react-toastify";
import BN from "bn.js";

import { useGunAccount } from "../../stores/useGunAccount";
import { useEncryption } from "../../stores/useEncryption";
import { useContracts } from "../../stores/useContracts";
import { useProvider } from "../../stores/useProvider";
import { Auth } from "../chat/Auth";
import { Chat } from "../chat/Chat";
import { KeyStorage } from "../../ABI/typechain/KeyStorage";
import NavMenu from "../base/NavMenu";
import LoadableButton from "../base/LoadableButton";
import { Messages } from "./Messages" 
import SwitchTheme from "../base/SwitchTheme";
import Sidebar from "../Sidebar";





interface MainpageProps {}

export const Mainpage: React.FC<MainpageProps> = () => {

  const [isGeneratingSharedKey, setIsGeneratingSharedKey] =
    useState<boolean>(false);
  const provider = useProvider((state) => state.provider);
  const isGunLogged = useGunAccount((state) => state.isLogged);

  const privateKey = useEncryption((state) => state.privateKey);
  const encryptor = useEncryption((state) => state.encryptor);
  const curve = useEncryption((state) => state.curve);

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



  return (

    <div className="flex flex-row justify-start relative">
          <Sidebar />
      <div className="w-full dapp-content dapp-bg">
        {isGunLogged ? (
          <Chat isGeneratingSharedKey={isGeneratingSharedKey} />
        ) : (
          <Auth />
        )}
      </div>
    </div>
  );
};