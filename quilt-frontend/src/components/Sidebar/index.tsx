import { Link, NavLink } from "react-router-dom";
import Messages from "../../assets/messages.svg";
import Group from "../../assets/group.svg";
import Settings from "../../assets/settings.svg";
import Toggle from "../../assets/toggle.svg";
import Connection from "../../assets/connection.svg";
import Bell from "../../assets/Bell.svg";
import Escrow from "../../assets/Escrow.png";

function Sidebar() {
  return (
    <div className="w-150 main-menu">
      <nav className="side-menu">
        <ul className="side-menu-items">
          <li>
            <NavLink to="/">
              <img src={Messages} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/addfriends">
              <img src={Group} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings">
              <img src={Settings} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/escrow">
              <img src={Escrow} width="16px"/>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
