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

    return (
      <div>
        <h1>Welcome {walletAddress}</h1>
        <button onClick={() => logout()} disabled={isAuthenticating}>
          Disconnect
        </button>
      </div>
    );
  }
};

export default Moralis;
