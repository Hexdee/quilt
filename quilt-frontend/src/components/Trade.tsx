import { ethers, Contract } from "ethers";
import React from "react";
import NFTEscrow from "../ABI/NFTEscrow.json";
import NFT from "../ABI/NFT.json";

const EscrowAddress = "0xC14d9BcFC6356B25732d034dA9b0aF8B57DCFA49"

interface TradeProps {
  buyerAddress: string;
  handleClose: () => void;
}

declare let window: any;

const Trade: React.FC<TradeProps> = ({handleClose, buyerAddress}) => {

  async function startTrade(e: React.SyntheticEvent): Promise<Number> {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      nft_contract: {value: string};
      token_id: {value: Number};
      price: {value: Number};
    }
    
    const NFTContract = target.nft_contract.value;
    const tokenID = target.token_id.value;
    const price = target.price.value;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nft:Contract = new ethers.Contract(NFTContract, NFT.abi, signer);
    const escrowContract:Contract = new ethers.Contract(EscrowAddress, NFTEscrow.abi, signer);
    const approveTx =  await nft.approve(EscrowAddress, tokenID);
    await approveTx.wait();

    const tradeId = await escrowContract.totalTrades();
    const startTradeTx = await escrowContract.startTrade(NFTContract, tokenID, buyerAddress, price);
    await startTradeTx.wait();

    return tradeId;
  }

  async function acceptTrade(tokenID: Number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const escrowContract:Contract = new ethers.Contract(EscrowAddress, NFTEscrow.abi, signer);

    const acceptTradeTx = await escrowContract.accept(tokenID);
    await acceptTradeTx.wait();
  }

  async function cancelTrade(tokenID: Number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const escrowContract:Contract = new ethers.Contract(EscrowAddress, NFTEscrow.abi, signer);

    const cancelTradeTx = await escrowContract.cancelTrade(tokenID);
    await cancelTradeTx.wait();
  }



  return (
    <div className="popup-box">
      <div className="box">
        <form className="escrow-form" onSubmit={startTrade}>
        <div className="escrow-form_heading"><h1>Quilt Escrow service</h1><p onClick={handleClose}>x</p></div>
        <input name="nft_contract" type="text" className="escrow-input" placeholder="Enter NFT Contract Address:"/>
        <input name="token_id" type="text" className="escrow-input" placeholder="Enter NFT token ID:"/>
        <input name="price" type="number" className="escrow-input" placeholder="Enter Price:"/>
        <input id="btn" className="escrow-button" type="submit" value="Approve"/>
        </form>
      </div>
    </div>
  );
};
 
export default Trade;