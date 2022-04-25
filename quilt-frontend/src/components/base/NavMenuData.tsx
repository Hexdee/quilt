import React from 'react'
import * as FaIcons from 'react-icons/fa';
import Messages from '../../assets/messages.svg';
import AddFriend from '../../assets/addFriend.svg'
import Group from '../../assets/group.svg'
import Settings from '../../assets/settings.svg'

export const SidebarData = [
    {
        title: '',
        path: '/',
        icon: <img src={Messages} />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Messages',
    //     path: '/messages',
    //     icon: <img src={Messages} />,
    //     cName: 'nav-text'
    // },
    {
        title: '',
        path: '/addfriends',
        icon: <img src={AddFriend} />,
        cName: 'nav-text'
    },
    {
        title: '',
        path: '/settings',
        icon: <img src={Settings} />,
        cName: 'nav-text'
    }
]

