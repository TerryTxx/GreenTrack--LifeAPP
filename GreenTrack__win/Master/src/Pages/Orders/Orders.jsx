import { useState } from "react";
import { Button } from "react-bootstrap";
import OrderItem from "./Order";
import { useNavigate, Link } from "react-router-dom";
import "./Order.css";
import succeed_IMG from '../Images/succeed.png'
const Orders = () => {
  const navigate = useNavigate();
  const getGoBack=()=>{
    navigate("/me");
  }
  return (
    <div className="order-succeed">
      <img className="s_img" src={succeed_IMG} alt="" />
      <p>your order has been placed successfully!</p>
      <Button onClick={getGoBack} className="submit-btn">GOBACK</Button>
    </div>
  );
};

export default Orders;
