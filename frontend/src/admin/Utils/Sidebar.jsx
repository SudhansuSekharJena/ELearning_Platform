import React from "react";
import "./common.css";
import { FaHome } from "react-icons/fa";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={`/admin/dashboard`}>
            <div className="icon">
              <FaHome/>
            </div>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to={`/admin/course`}>
            <div className="icon">
              <FaBook/>
            </div>
            <span>Courses</span>
          </Link>
        </li>

        <li>
          <Link to={`/admin/users`}>
            <div className="icon">
              <FaUserAlt/>
            </div>
            <span>Users</span>
          </Link>
        </li>

        <li>
          <Link to={`/account`}>
            <div className="icon">
            <IoLogOut/>
            </div>
            <span>Logout</span>

          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
