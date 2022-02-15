import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useCallback, useEffect } from "react";
import { ethers } from "ethers";

import { readPrivateKey, readUsername } from "./scripts/storage/storeAccount";
import { CONTRACT_ADDRESS_FUJI } from "./constants/contractConstants";
import { readFriendsList } from "./scripts/storage/storeFriendsList";
import { createEllipticCurve } from "./scripts/ECDH/curveFactory";
import { createEncryptor } from "./scripts/encryption/encryption";
import { KeyStorage } from "./ABI/typechain/KeyStorage";
import { useGunAccount } from "./stores/useGunAccount";
import { Mainpage } from "./components/pages/Mainpage";

import { useEncryption } from "./stores/useEncryption";
import { useContracts } from "./stores/useContracts";
import { useMessages } from "./stores/useMessages";
import { useProvider } from "./stores/useProvider";

import ContractData from "./ABI/KeyStorage.json";
import { NavBar } from "./components/NavBar";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const provider = useProvider((state) => state.provider);
  const setContract = useContracts((state) => state.setContract);
  const isGunLogged = useGunAccount((state) => state.isLogged);
  const setFriendsList = useMessages((state) => state.setFriends);

  const setPrivateKey = useEncryption((state) => state.setPrivateKey);
  const setEncryptor = useEncryption((state) => state.setEncryptor);
  const setEllipticCurve = useEncryption((state) => state.setCurve);

  const initializeConctractInstance = useCallback(() => {
    if (!(CONTRACT_ADDRESS_FUJI && provider)) {
      return new Error("Failed to connect to the contract");
    }

    setContract(
      new ethers.Contract(
        CONTRACT_ADDRESS_FUJI,
        ContractData.abi,
        provider.getSigner()
      ) as KeyStorage
    );
  }, [provider, setContract]);

  const initailizeEllipticCurve = useCallback(() => {
    setEllipticCurve(createEllipticCurve("secp256r1"));
  }, [setEllipticCurve]);

  const initializeEncryptor = useCallback(() => {
    const encryptor = createEncryptor();

    setEncryptor(encryptor);
  }, [setEncryptor]);

  const initalizeAccount = useCallback(() => {
    const privateKey = readPrivateKey();
    const username = readUsername();

    if (!(privateKey && username)) {
      return;
    }

    setPrivateKey(privateKey);
  }, [setPrivateKey]);

  useEffect(() => {
    initializeConctractInstance();
    initailizeEllipticCurve();
    initializeEncryptor();
    initalizeAccount();
  }, [
    initializeConctractInstance,
    initailizeEllipticCurve,
    initializeEncryptor,
    initalizeAccount,
  ]);

  useEffect(() => {
    if (!isGunLogged) return;
    const friendsList: string[] | undefined = readFriendsList();

    if (!friendsList?.length) return;
    setFriendsList(friendsList);
  }, [isGunLogged, setFriendsList]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <NavBar />
      <Routes>
        <Route path="/" element={<Mainpage />} />
      </Routes>
    </>
  );
}

export default App;
