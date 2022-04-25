import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Messages from '../../assets/messages.svg';
import AddFriend from '../../assets/addFriend.svg'
import Group from '../../assets/group.svg'
import Settings from '../../assets/settings.svg'
import { SidebarData } from './NavMenuData'

 
function NavMenu() {
    const[sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)


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

        <nav className={sidebar ? 'side-menu active' : 'side-menu'}>
            <ul className='side-menu-items'>
                <li className="side-menu-toggle">
                    <Link to="#" className='menu-bars'>
                        <FaIcons.FaTimes />
                    </Link>
                </li>
                {SidebarData.map((item, index) => {

                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )

                }
                )}
            </ul>
        </nav> 
    </>
  )
}

export default NavMenu