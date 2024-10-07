import React from 'react'
import "./header.css"
import { NavLink } from 'react-router-dom'

const Header = ({isAuth}) =>{
  return(
    <header>
      <div className="logo">E-Learning</div>

      <div className="link">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/courses"}>Courses</NavLink>
        <NavLink to={"/about"}>About</NavLink>
        {
          isAuth ? ( 
          <NavLink to={"/account"}>Account</NavLink> 
          ) : (<NavLink to={"/login"}>Login</NavLink>)
        }
        
      </div>
    </header>
  )
};

export default Header; 