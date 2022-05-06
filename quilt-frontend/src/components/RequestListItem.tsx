import React, { memo } from "react";
import AddAccount from "../assets/add_account.svg";
import { trimEthereumAddress } from "../helpers/trimEthereumAddress";
import { useFriendsList } from "../stores/useFriendsList";

interface RequestListItemProps {
  handleSetFriend: (address: string) => void;
  address: string;
}

export const RequestListItem: React.FC<RequestListItemProps> = memo(
  ({ handleSetFriend, address }) => {
    return (
      <div
        className="w-full rounded-lg h-20 text-white flex flex-row justify-between items-center text-xl my-2 px-4 cursor-pointer hover:scale-95"
        onClick={() => handleSetFriend(address)}
      >
        <div className="h-12 w-12 rounded-full bg-slate-800"></div>
        <div className="overflow-hidden w-40">
          {trimEthereumAddress(address, 22)}
        </div>
        <div>
          <button
            onClick={() => {
              useFriendsList.getState().addFriend(address, { username: "" });
            }}
            className="w-25 h-25 font-bold text-sm flex items-center justify-center"
          >
            <img src={AddAccount} width={40} height={40} />
          </button>
        </div>
      </div>
    );
  }
);
