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
        className="my-2 flex h-20 w-full cursor-pointer flex-row items-center justify-between rounded-lg px-4 text-xl text-white hover:scale-95"
        onClick={() => handleSetFriend(address)}
      >
        <div className="h-12 w-12 rounded-full bg-slate-800"></div>
        <div className="w-40 overflow-hidden">
          {trimEthereumAddress(address, 22)}
        </div>
        <div>
          <button
            onClick={() => {
              useFriendsList.getState().addFriend(address, { username: "" });
            }}
            className="w-25 h-25 flex items-center justify-center text-sm font-bold"
          >
            <img src={AddAccount} width={40} height={40} />
          </button>
        </div>
      </div>
    );
  }
);
