import React from "react";
import "./account.css";
import { MdSpaceDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { UserData } from "../../context/UserContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setUser, setIsAuth } = UserData();
  const navigate = useNavigate();

  function logoutHandler() {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logout successfully");
    navigate("/login");
  }

  return (
    <div>
      {user && (
        <div className="profile">
          <div className="profile-info">
            <p>
              <strong> Name: {user.name}</strong>
            </p>

            <p>
              <strong>Email: {user.email} </strong>
            </p>
            <div className="btns">
              <button
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="common-btn"
              >
                <MdSpaceDashboard />
              </button>

              <br />

              {user && user.role ==="admin" && (
                <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn"
              > 
                <MdSpaceDashboard />
                Admin Dashboard

              </button>
              )}

              

              <br />

              <button
                onClick={logoutHandler}
                className="common-btn"
                style={{ background: "red" }}
              >
                <IoLogOut />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
