import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import Gun from "gun";

import { readPrivateKey, readUsername } from "./modules/storage/storeAccount";
import { CONTRACT_ADDRESS_FUJI } from "./constants/contractConstants";
import { readFriendsList } from "./modules/storage/storeFriendsList";
import { createEllipticCurve } from "./modules/ECDH/curveFactory";
import { createEncryptor } from "./modules/encryption/encryption";
import { KeyStorage } from "./ABI/typechain/KeyStorage";
import { useGunAccount } from "./stores/useGunAccount";
import { Mainpage } from "./components/pages/Mainpage";
import ContractData from "./ABI/KeyStorage.json";
import { NavBar } from "./components/NavBar";
import { gunDbAddress } from "./constants/gundb";
import "react-toastify/dist/ReactToastify.css";

import { useEncryption } from "./stores/useEncryption";
import { useContracts } from "./stores/useContracts";
import { useProvider } from "./stores/useProvider";
import { useFriendsList } from "./stores/useFriendsList";
import { useGunConnection } from "./stores/useGunConnection";

function App() {
  const provider = useProvider((state) => state.provider);
  const setContract = useContracts((state) => state.setContract);
  const isGunLogged = useGunAccount((state) => state.isLogged);
  const setFriendsList = useFriendsList((state) => state.setFriends);
  const setGunConnection = useGunConnection((state) => state.setGunConnection);

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

  const initializeGunConnection = useCallback(() => {
    require("gun/sea");

    const gun = Gun({
      peers: [gunDbAddress],
    });

    setGunConnection(gun);
  }, [setGunConnection]);

  useEffect(() => {
    initializeConctractInstance();
    initailizeEllipticCurve();
    initializeEncryptor();
    initalizeAccount();
    initializeGunConnection();
  }, [
    initializeConctractInstance,
    initailizeEllipticCurve,
    initializeEncryptor,
    initalizeAccount,
    initializeGunConnection,
  ]);

  useEffect(() => {
    const friendsObject = readFriendsList();
    useFriendsList.getState().setInitialized(true);

    if (!friendsObject || Object.keys(friendsObject).length === 0) return;

    setFriendsList(friendsObject);
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
