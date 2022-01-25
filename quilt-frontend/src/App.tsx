import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useProvider } from "./stores/useProvider";
//import ContractData from "@quilt/contracts/artifacts/contracts/KeyStorage.sol/KeyStorage.json";
import ContractData from "./ABI/KeyStorage.json";
import { CONTRACT_ADDRESS } from "./constants/contractConstants";
import { useContracts } from "./stores/useContracts";
import { NavBar } from "./components/NavBar";
import { Mainpage } from "./components/pages/Mainpage";
import { Route, Routes } from "react-router-dom";
import { KeyStorage } from "@quilt/contracts/typechain";
import { createEllipticCurve } from "./scripts/ECDH/curveFactory";
import { useEncryption } from "./stores/useEncryption";
import { createEncryptor } from "./scripts/encryption/encryption";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { readAccount } from "./scripts/storage/storeGunAccount";
import { useGunAccount } from "./stores/useGunAccount";

function App() {
  const [error, setError] = useState<String>("");
  const provider = useProvider((state) => state.provider);
  const setContract = useContracts((state) => state.setContract);
  const setEllipticCurve = useEncryption((state) => state.setCurve);
  const setEncryptor = useEncryption((state) => state.setEncryptor);
  const isGunLogged = useGunAccount((state) => state.isLogged);
  const setPrivateKey = useEncryption((state) => state.setPrivateKey);

  const initializeConctractInstance = useCallback(async () => {
    try {
      if (!(CONTRACT_ADDRESS && provider)) {
        console.log(provider);
        throw new Error(
          "[initializeConctractInstance] chat contract address or provider is not specified"
        );
      }

      setContract(
        new ethers.Contract(
          CONTRACT_ADDRESS,
          ContractData.abi,
          provider.getSigner()
        ) as KeyStorage
      );
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  }, [provider, setContract]);

  const initailizeEllipticCurve = useCallback(() => {
    setEllipticCurve(createEllipticCurve("secp256r1"));
  }, [setEllipticCurve]);

  const initializeEncryptor = useCallback(() => {
    const encryptor = createEncryptor();

    setEncryptor(encryptor);
  }, [setEncryptor]);

  const initalizeGunAccount = useCallback(() => {
    const privateKey = readAccount();

    if (!privateKey) {
      return;
    }

    setPrivateKey(privateKey);
  }, [setPrivateKey]);

  useEffect(() => {
    initializeConctractInstance();
    initailizeEllipticCurve();
    initializeEncryptor();
    initalizeGunAccount();
  }, [
    initializeConctractInstance,
    initailizeEllipticCurve,
    initializeEncryptor,
    initalizeGunAccount,
  ]);

  useEffect(() => {
    console.log(isGunLogged);
  }, [isGunLogged]);

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
