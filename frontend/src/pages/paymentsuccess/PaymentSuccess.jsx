import React from "react";
import "./paymentSuccess.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ user }) => {
  // payment success, url should be /payment-success/${course._id} or we can say params.id
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div>
      <div className="payment-success-page">
        {user && (
          <div className="success-message">
            <h1>Payment Successful</h1>
            <p>Your course has been activated and added to your dashboard</p>
            <p>Course ID: {params.id}</p>
            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
              className="common-btn"
            >
              Go to DashBoard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
