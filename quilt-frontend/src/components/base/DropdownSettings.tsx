import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Messages from '../../assets/messages.svg';
import AddFriend from '../../assets/addFriend.svg'
import Group from '../../assets/group.svg'
import Settings from '../../assets/settings.svg'
import { dropdownData } from './NavMenuData'

 
function Dropdown() {
    const[sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    const [dropdown, setDropdown] = useState(false);

  return (
    <>
    <nav className='side-menu sub-menu'>
    
              <ul className={dropdown ? "services-submenu clicked" : "services-submenu" } onClick={() => setDropdown(!dropdown)}>
                {/* <li className="side-menu-toggle">
                    <Link to="#" className='menu-bars'>
                        <FaIcons.FaTimes />
                    </Link>
                </li> */}
                {dropdownData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path} onClick={() => setDropdown(false)}> 
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

export default Dropdown