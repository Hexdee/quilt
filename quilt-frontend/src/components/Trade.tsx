import React from "react";

interface TradeProps {}

const Trade: React.FC<TradeProps> = () => {
  function startTrade(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
  }

  return (
    <div className="popup-box">
      <div className="box">
        <form className="escrow-form" action="">
        <h1>Quilt Escrow service</h1>
        <input type="text" className="escrow-input" placeholder="Enter NFT Contract Address:"/>
        <input type="text" className="escrow-input" placeholder="Enter NFT token ID:"/>
        <button className="escrow-button" onClick={startTrade}>Start Trade</button>
        </form>
        {/* <span className="close-icon" onClick={handleClose}>x</span> */}
      </div>
    </div>
  );
};
 
export default Trade;