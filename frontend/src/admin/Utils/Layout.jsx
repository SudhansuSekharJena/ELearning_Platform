import React from 'react'
import Sidebar from "./Sidebar.jsx";
import "./common.css";

const Layout = ({ children }) => {
  return (
    <div>
      <div className="dashboard-admin">
        <Sidebar/>
        <div className="content">{children} </div>
      </div>
    </div>
  )
}

export default Layout
