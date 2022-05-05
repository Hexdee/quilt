import { Link, NavLink } from "react-router-dom";

import Toggle from '../../assets/toggle.svg';
import Connection from '../../assets/connection.svg';
import DropdownSettings from "../base/DropdownSettings";
import { IsLoggedCheck } from "../base/IsLoggedCheck";

function Dropdown() {
    return (
        <div className="w-full">
     {/* <nav className='side-menu'> */}

        {/* <ul className='side-menu-items'> */}
             <NavLink to="/settings/profile">
                <li>Profile</li>
            </NavLink>
            <NavLink to="/Generate Private Key">
                <button>btn</button>
            </NavLink>

            <NavLink to="/settings">
               <li>My Wallet Address</li> 
            </NavLink> 
            <NavLink to="/settings">
               <li>Switch to Light Mode</li> 
               <img src={Toggle} />
            </NavLink> 
            <NavLink to="/settings">
               <li><IsLoggedCheck/></li> 
               <img src={Connection} />
            </NavLink> 
        {/* </ul> */}

     {/* </nav> */}
     </div>
    );
}

export default Dropdown