import { Link, NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Toggle from '../assets/toggle.svg';
import DropdownSettings from "./base/DropdownSettings";
import { IsLoggedCheck } from "./base/IsLoggedCheck";
import { useUserData } from "../stores/useUserData";
import { LoadableButton } from "./base/LoadableButton";
import { useWallet } from "../hooks/useWallet";
import { RiLogoutBoxLine } from "react-icons/ri";
import Copy from "../assets/copy-solid.svg";
import { KeyGen } from "./chat/KeyGen";
import SwitchTheme from "./base/SwitchTheme";

interface DropdownProps {} 

export const Dropdown: React.FC<DropdownProps> = () => {
  const isLogged = useUserData((state) => state.isLogged);
  const address = useUserData((state) => state.address);
  const [isConnecting, connectWallet, disconnectWallet] = useWallet();

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);  

    return (
<div>

        <div className="w-full">
    <nav className='side-menu sub-menu'>
    <ul className="services-submenu">
      <li>
        <NavLink to="./profile">
          Profile
        </NavLink>
      </li>
      <li>
        <NavLink to="/settings">
          <KeyGen />
        </NavLink>
      </li>
      <li className="text-xl hover:scale-95 transition-all duration-75 " onClick={() => navigator.clipboard.writeText(address)}>
        My wallet address
        <img src={Copy} className="ml-1 copy-btn" />

      </li>
      <li onClick={() => <SwitchTheme/>}>
        <NavLink to="#">
          Switch to Light Mode <img src={Toggle} alt="" className="ml-1 toggle-btn" />
        </NavLink>
      </li>
     
              </ul>
            </nav>
     </div>
     </div>
    );
};
