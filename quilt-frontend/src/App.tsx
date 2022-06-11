import { ToastContainer } from "react-toastify";
import { NavBar } from "./components/NavBar";
import React, { Component } from "react";
import {
  Route,
  Routes,
  NavLink,
  HashRouter
} from "react-router-dom";
import { Mainpage } from "./components/pages/Mainpage";
import { Messages } from "./components/pages/Messages";
import { Settings } from "./components/pages/Settings";
import { Profile } from "./components/pages/Profile";
import { Escrow } from "./components/pages/Escrow";


import "react-toastify/dist/ReactToastify.css";

import { useStoredFriendsList } from "./hooks/useStoredFriendsList";
import { useInitializeModules } from "./hooks/useInitializeModules";
import { AddFriends } from "./components/pages/Addfriends";

function App() {
  useStoredFriendsList();
  useInitializeModules();

  return (
    <>
    <NavBar/>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Routes>
        <Route path="/" element={<Mainpage />} />
        {/* <Route path="/messages" element={<Messages />} /> */}
        <Route path='/addfriends' element={<AddFriends />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings/profile' element={<Profile />} />
        <Route path="/escrow" element={<Escrow/>}/>
        </Routes>
    </>
  );
}

export default App;
