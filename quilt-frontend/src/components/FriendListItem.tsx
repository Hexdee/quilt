import React, { memo } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { trimEthereumAddress } from "../helpers/trimEthereumAddress";
import Claire from "../assets/claire.svg";
import DeleteUser from "../assets/delete_user.svg";

interface FriendListItemProps {
  handleSetFriend: (address: string) => void;
  handleRemoveFriend: (address: string) => void;
  address: string;
}

export const FriendListItem: React.FC<FriendListItemProps> = memo(
  ({ handleSetFriend, handleRemoveFriend, address }) => {
    return (
      <div
        className="my-2 flex h-20 w-full cursor-pointer flex-row items-center justify-between rounded-lg px-4 text-xl text-white hover:scale-105"
        onClick={() => handleSetFriend(address)}
      >
        {/* <div className="claire rounded-full">
          <img src={Claire} />
        </div>
        <div className="overflow-hidden">
          Claire
        </div> */}
        <div className="h-12 w-12 rounded-full bg-slate-800"></div>

        <div className="overflow-hidden">
          {trimEthereumAddress(address, 22)}
        </div>
        <div>
          <button
            onClick={() => handleRemoveFriend(address)}
            className="flex items-center justify-center text-sm font-bold"
          >
            <img src={DeleteUser} width={40} height={40} />
          </button>
        </div>
      </div>
    );
  }
);
