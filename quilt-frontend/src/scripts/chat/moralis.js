import { useMoralis } from "react-moralis";

const Moralis = () => {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const { logout, isAuthenticating } = useMoralis();

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Connect Wallet</button>
      </div>
    );
  } else {
    const walletAddress = user.get("ethAddress");

    return null;

    // return (
    //   <div>
    //     <button
    //       onClick={() => logout()}
    //       disabled={isAuthenticating}
    //       className="border-2 border-yellow-500 bg-yellow-300 p-4 block rounded-2xl text-black w-60 h-16 m-2"
    //     >
    //       Disconnect
    //     </button>
    //   </div>
    // );
  }
};

export default Moralis;
