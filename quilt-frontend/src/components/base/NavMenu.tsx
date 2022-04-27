import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Messages from '../../assets/messages.svg';
import AddFriend from '../../assets/addFriend.svg'
import Group from '../../assets/group.svg'
import Settings from '../../assets/settings.svg'
import { SidebarData } from './NavMenuData';
import Dropdown from './Dropdown';

 
function NavMenu() {
    // const[sidebar, setSidebar] = useState(false)

    // const showSidebar = () => setSidebar(!sidebar)

    const[dropdown, setDropdown] = useState(false);

  return (
    <>
        {/* <div className="side-menu">
            <Link to="#" className="menu-bars">
                <img src={Messages} alt="messageIcon" />
            </Link>
            <Link to="#" className="menu-bars">
                <img src={AddFriend} onClick={showSidebar} alt="addfriend" />
            </Link>
            <Link to="#" className="menu-bars">
                <img src={Group} alt="group" />
            </Link>
            <Link to="#" className="menu-bars">
                <img src={Settings} alt="settings" />
            </Link>
        </div> */}

        {/* <nav className={sidebar ? 'side-menu active' : 'side-menu'}> */}
    <nav className='navbar'>
    
        {/* <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/stuff">Stuff</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul> */}

          {/* <Link to="/" className="navbar-logo" */}

    
             { <ul className='side-menu-items'>
                <li className="side-menu-toggle">
                    <Link to="#" className='menu-bars'>
                        <FaIcons.FaTimes />
                    </Link>
                </li>
                {SidebarData.map((item, index) => {
                    if(item.dropdown == true) {
                        return (
                            <li key={index} className={item.cName}>
                            <Link to={item.path} 
                            onClick={() => setDropdown(true)}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                            {dropdown && <Dropdown />}
                        </li> 
                        )
                    }
                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                            {dropdown && <Dropdown />}
                        </li>
                    )

                }
                )}
            </ul> }
        </nav> 
    </>
  )
}

export default NavMenu