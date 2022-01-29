import { ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { useProvider } from "./stores/useProvider";
import ContractData from "./ABI/KeyStorage.json";
import { CONTRACT_ADDRESS } from "./constants/contractConstants";
import { useContracts } from "./stores/useContracts";
import { NavBar } from "./components/NavBar";
import { Mainpage } from "./components/pages/Mainpage";
import { Route, Routes } from "react-router-dom";
import { KeyStorage } from "./ABI/typechain/KeyStorage";
import { createEllipticCurve } from "./scripts/ECDH/curveFactory";
import { useEncryption } from "./stores/useEncryption";
import { createEncryptor } from "./scripts/encryption/encryption";
import { ToastContainer } from "react-toastify";
import { readPrivateKey, readUsername } from "./scripts/storage/storeAccount";
import { useGunAccount } from "./stores/useGunAccount";
import { readFriendsList } from "./scripts/storage/storeFriendsList";
import { useMessages } from "./stores/useMessages";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const provider = useProvider((state) => state.provider);
  const setContract = useContracts((state) => state.setContract);
  const setEllipticCurve = useEncryption((state) => state.setCurve);
  const setEncryptor = useEncryption((state) => state.setEncryptor);
  const isGunLogged = useGunAccount((state) => state.isLogged);
  const setPrivateKey = useEncryption((state) => state.setPrivateKey);
  const setFriendsList = useMessages((state) => state.setFriends);

  const initializeConctractInstance = useCallback(async () => {
    try {
      if (!(CONTRACT_ADDRESS && provider)) {
        throw new Error("Failed to connect to the contract");
      }

      setContract(
        new ethers.Contract(
          CONTRACT_ADDRESS,
          ContractData.abi,
          provider.getSigner()
        ) as KeyStorage
      );
    } catch (error: any) {
      return;
    }
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

    if (!privateKey || !username) {
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

    const friendsList: undefined | Array<string> = readFriendsList();

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
        <Route path="/" element={<Mainpage></Mainpage>} />
      </Routes>
    </>
  );
}

export default App;
