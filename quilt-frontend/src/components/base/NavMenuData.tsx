import React from 'react'
import * as FaIcons from 'react-icons/fa';
import Messages from '../../assets/messages.svg';
import AddFriend from '../../assets/addFriend.svg';
import Group from '../../assets/group.svg';
import Settings from '../../assets/settings.svg';
import Toggle from '../../assets/toggle.svg';
import Connection from '../../assets/connection.svg';



export const SidebarData = [
    {
        // id: 1,
        title: '',
        path: '/',
        icon: <img src={Messages} />,
        cName: 'nav-text',
        dropdown: false
    },
    // {
    //     title: 'Messages',
    //     path: '/messages',
    //     icon: <img src={Messages} />,
    //     cName: 'nav-text'
    // },
    {
        // id: 2,
        title: '',
        path: '/addfriends',
        icon: <img src={Group} />,
        cName: 'nav-text',
        dropdown: false
    },
    {
        // id: 3,
        title: '',
        path: '/settings',
        icon: <img src={Settings} />,
        cName: 'nav-text',
        dropdown: true
    }
]

export const dropdownData = [
    {
        // id: 1,
        title: "Profile",
        path: "./profile",
        icon: '',
        cName: "submenu-item"
    },
    {
        // id: 2,
        title: "Generate Private Key",
        path: "./generateKey",
        icon: '',
        cName: "submenu-item"
    },
    {
        // id: 3,
        title: "My Wallet Address",
        path: "./walletAdress",
        icon: '',
        cName: "submenu-item"
    },
    {
        // id: 4,
        title: "Switch to Light Mode",
        path: "./switch-to-light",
        icon: <img src={Toggle} />,
        cName: "submenu-item"
    },
    {
        // id: 5,
        title: "Connect Wallet",
        path: "./connect",
        icon: <img src={Connection} />,
        cName: "submenu-item"
    },  


]

