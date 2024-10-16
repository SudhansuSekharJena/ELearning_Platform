import React, { useState } from "react";
import "./auth.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/api/user/reset?token=${params.token}`,
        {
          password,
        }
      );

      navigate("/login");
      setBtnLoading(false);
      toast.success(data.message);
    } catch (error) {
      setBtnLoading(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Reset Password</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor="resetPassword">Enter New Password</label>
          <input
            id="resetPassword"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />

          <div className="buttonbox">
            <button type="submit" className="common-btn">
            {btnLoading ? "Please wait..." : "Reset Password"}
          </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
