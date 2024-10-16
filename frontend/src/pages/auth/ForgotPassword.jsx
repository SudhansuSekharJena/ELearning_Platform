import React, { useState } from "react";
import "./auth.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post(`${server}/api/user/forgot`, { email });

      toast.success( data.message );
      navigate("/login");
      setBtnLoading(false);  
    } catch (error) {
      setBtnLoading(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor="email">Enter Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <div className="buttonbox">
            <button type="submit" className="common-btn" disabled={btnLoading}>
            {btnLoading? "Please wait..." : "Forgot Password" }
          </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
