import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './NavMenuData';
import Dropdown from './DropdownSettings';
import { AddFriends } from '../pages/Addfriends';

 
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
    <nav className='side-menu'>
    
        {/* <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/stuff">Stuff</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul> */}

          {/* <Link to="/" className="navbar-logo" */}

    
             { <ul className='side-menu-items'>
                {/* <li className="side-menu-toggle">
                    <Link to="#" className='menu-bars'>
                        <FaIcons.FaTimes />
                    </Link>
                </li> */}
                {SidebarData.map((item) => {
              
                    if(item.dropdown == true) {
                        return (
                            <li key={item.id} className={item.cName}>
                            <Link to={item.path} 
                            onClick={() => setDropdown(true)} 
                            onMouseEnter={() => setDropdown(true)}
                            onMouseLeave={() => setDropdown(false)}
                            >
                                <span>{item.title} {item.icon}</span>
                            </Link>
                            {dropdown && <Dropdown />}
                        </li> 
                        )
                    }
                    return (
                        <li key={item.id} className={item.cName}>
                            <Link to={item.path}
                            onMouseEnter={() => setDropdown(true)}
                            onMouseLeave={() => setDropdown(false)}
                            >
                                <span>{item.title} {item.icon} </span>
                            </Link>
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