import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { createEllipticCurve } from "../../scripts/ECDH/curveFactory";
import { createEncryptor } from "../../scripts/encryption/encryption";
import { useContracts } from "../../stores/useContracts";
import { useProvider } from "../../stores/useProvider";

interface MainpageChatProps {}

const curve = createEllipticCurve("secp256r1");

export const MainpageChat: React.FC<MainpageChatProps> = ({}) => {
  const [privateKey, setPrivateKey] = useState<String>("");
  const [publicX, setPublicX] = useState<String>("");
  const [publicY, setPublicY] = useState<String>("");
  const keyStorage = useContracts((state) => state.contract);
  const provider = useProvider((state) => state.provider);

  const generateKeyPair = () => {
    const [privateKey, publicKey] = curve.makeKeyPair();

    if (!publicKey) return;

    setPrivateKey(privateKey.toString(10));
    setPublicX(publicKey.x.toString(10));
    setPublicY(publicKey.y.toString(10));

    console.log("Generated private key -> " + privateKey.toString(10));
    console.log("Generated public key (X) -> " + publicKey?.x.toString(10));
    console.log("Generated public key (Y) -> " + publicKey?.y.toString(10));
  };

  const postData = async () => {
    if (!(keyStorage && provider))
      return alert("provider or contract is not defined");

    if (!(publicX && publicY)) return alert("public key is not defined");

    const tx = await keyStorage.setUserKey(
      BigNumber.from(publicX),
      BigNumber.from(publicY)
    );

    console.log("Transaction");
    console.log(tx);
  };

  const testEncryption = () => {
    const encryption = createEncryptor();

    encryption.setSharedSecret("Vitcos", "123");
    console.log(
      "Encryption key for Vitcos -> " + encryption.getSharedSecret("Vitcos")
    );
    const encryptedToVitocs = encryption.encrypt("Hello world", "Vitcos");

    if (!encryptedToVitocs)
      return console.log("Error encrpyted message returned undefined");
    console.log("Encrpyted message -> " + encryptedToVitocs?.toString());

    const decrypted = encryption.decrypt(
      encryptedToVitocs.toString(),
      "Vitcos"
    );

    if (!decrypted)
      return console.log("Error decrypted message returned undefined");
    console.log("Decrypted message -> " + decrypted.toString());
  };

  useEffect(() => {
    if (!(keyStorage && provider)) {
      console.log("gameContract or provider is undefined");
      return;
    }

    console.log("setting up listener");

    keyStorage.on("KeyPublished", (...args) => {
      console.log("Event was caught");
      console.log(args);
    });

    return () => {
      keyStorage.removeAllListeners();
    };
  }, [keyStorage, provider]);

  return (
    <>
      <div className="w-1/2 mx-auto mt-32">
        <div className="w-full flex flex-row justify-around">
          <button
            onClick={() => generateKeyPair()}
            className="border-2 border-yellow-500 bg-yellow-300 p-4 block rounded-2xl text-black w-96 h-16 m-2"
          >
            Generate private key
          </button>
          <button
            onClick={() => postData()}
            className="border-2 border-yellow-500 bg-yellow-300 p-4 block rounded-2xl text-black w-96 h-16 m-2"
          >
            Post key to blockchain
          </button>
          <button
            onClick={() => testEncryption()}
            className="border-2 border-yellow-500 bg-yellow-300 p-4 block rounded-2xl text-black w-96 h-16 m-2"
          >
            Test encryption
          </button>
        </div>
        <div className="mt-10 text-xl">Generated private key</div>
        {privateKey && <div className="mt-2 text-gray-400">{privateKey}</div>}
        <div className="mt-10 text-xl">Generated public key X</div>
        {publicX && <div className="mt-2 text-gray-400">{publicX}</div>}
        <div className="mt-10 text-xl">Generated public key Y</div>
        {publicY && <div className="mt-2 text-gray-400">{publicY}</div>}
        <div className="mt-20 text-3xl">Events</div>
        <div className="mt-5 text-gray-400">Waiting for new events . . .</div>
      </div>
    </>
  );
};
