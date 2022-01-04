import React, { useEffect, useState } from "react";
import {
  curveData,
  makeKeyPair,
  makePublicKeyFromPrivate,
} from "./scripts/ECDH";
import BN from "bn.js";

function App() {
  const [privateKey, setPrivateKey] = useState<String>("");
  const [publicX, setPublicX] = useState<String>("");
  const [publicY, setPublicY] = useState<String>("");

  const generatePrivateKey = () => {
    // const privateKey = new BN(
    //   "90683066454814006968631478597603926296832491423936555157155566137392880311387",
    //   10
    // );
    // const publicKey = makePublicKeyFromPrivate(privateKey, curveData);
    // setPrivateKey(
    //   "90683066454814006968631478597603926296832491423936555157155566137392880311387"
    // );

    const [privateKey, publicKey] = makeKeyPair();

    if (!publicKey) return;

    setPrivateKey(privateKey.toString(10));
    setPublicX(publicKey.x.toString(10));
    setPublicY(publicKey.y.toString(10));

    console.log("Generated private key -> " + privateKey.toString(10));
    console.log("Generated public key (X) -> " + publicKey?.x.toString(10));
    console.log("Generated public key (Y) -> " + publicKey?.y.toString(10));
  };

  const postData = () => {
    alert("This function is not implemented, yet");
  };

  return (
    <div className="w-1/2 mx-auto mt-32">
      <div className="w-full flex flex-row justify-around">
        <button
          onClick={() => generatePrivateKey()}
          className="border-2 border-yellow-500 bg-yellow-300 p-4 block rounded-2xl text-black w-96 h-16"
        >
          Generate private key
        </button>
        <button
          onClick={() => postData()}
          className="border-2 border-yellow-500 bg-yellow-300 p-4 block rounded-2xl text-black w-96 h-16"
        >
          Post key to blockchain
        </button>
      </div>
      <div className="mt-10 text-xl">Generated private key</div>
      {privateKey && <div className="mt-2 text-gray-400">{privateKey}</div>}
      <div className="mt-10 text-xl">Generated public key X</div>
      {privateKey && <div className="mt-2 text-gray-400">{publicX}</div>}
      <div className="mt-10 text-xl">Generated public key Y</div>
      {privateKey && <div className="mt-2 text-gray-400">{publicY}</div>}
      <div className="mt-20 text-3xl">Events</div>
      <div className="mt-5 text-gray-400">Waiting for new events . . .</div>
    </div>
  );
}

export default App;
