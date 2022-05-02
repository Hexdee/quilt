import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './NavMenuData';
import Dropdown from './Dropdown';
import Toggle from '../../assets/toggle.svg';

 
function SwitchTheme() {

  return (

<img src={Toggle} />

  )
}

export default SwitchTheme