import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useProvider } from "./stores/useProvider";
import ContractData from "@quilt/contracts/artifacts/contracts/KeyStorage.sol/KeyStorage.json";
import { CONTRACT_ADDRESS } from "./constants/contractConstants";
import { useContracts } from "./stores/useContracts";
import { NavBar } from "./components/NavBar";
import { Mainpage } from "./components/pages/Mainpage";
import { Route, Routes } from "react-router-dom";
import { KeyStorage } from "@quilt/contracts/typechain";

function App() {
  const [error, setError] = useState<String>("");

  const provider = useProvider((state) => state.provider);
  const setContract = useContracts((state) => state.setContract);

  const initializeConctractInstance = useCallback(async () => {
    try {
      console.log("initializeConctractInstance");

      if (!(CONTRACT_ADDRESS && provider)) {
        console.log(provider);
        throw new Error(
          "[initializeConctractInstance] game contract address or provider is not specified"
        );
      }

      console.log("setting game contract");
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

  useEffect(() => {
    initializeConctractInstance();
  }, [initializeConctractInstance]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Mainpage></Mainpage>} />
      </Routes>
    </>
  );
}

export default App;
