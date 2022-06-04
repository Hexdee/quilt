import React from "react";

interface TradeProps {
  handleClose: () => void
}

const Trade: React.FC<TradeProps> = ({handleClose}) => {
  function startTrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const tokenIDElement = e.currentTarget.elements.namedItem('token_id') as HTMLInputElement
    console.log(tokenIDElement.value)
  }

  return (
    <div className="popup-box">
      <div className="box">
        <form className="escrow-form" onSubmit={startTrade}>
        <div className="escrow-form_heading"><h1>Quilt Escrow service</h1><p onClick={handleClose}>x</p></div>
        <input name="nft_contract" type="text" className="escrow-input" placeholder="Enter NFT Contract Address:"/>
        <input name="token_id" type="text" className="escrow-input" placeholder="Enter NFT token ID:"/>
        <input name="price" type="number" className="escrow-input" placeholder="Enter Price:"/>
        <input className="escrow-button" type="submit" value="Start Trade"/>
        </form>
        {/* <span className="close-icon" onClick={handleClose}>x</span> */}
      </div>
    </div>
  );
};
 
export default Trade;