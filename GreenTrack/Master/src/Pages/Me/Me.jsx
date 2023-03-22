import React, { useState } from 'react';
import "./Me.css";
import { Button } from "react-bootstrap";
import { useAuth } from "../../Authentication"
import avatar from "../Images/avatar.png";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../Orders/Order.css";
import OrderItem from "../Orders/Order";
import tree_IMG from '../Images/tree.png'
import recycling_cloth_IMG from '../Images/recycling_cloth.png'
import green_baterry_IMG from '../Images/green_baterry.png'
import bike_IMG from '../Images/bike.png'
import segway_IMG from '../Images/segway.png'
import background_unlogin_IMG from '../Images/background_unlogin.png'
const order = [
  {
    name: 'tree',
    nums: 998,
    value: 1,
    price: 50,
    prices: 50,
    imgUrl: tree_IMG
  },
  {
    name: 'green battery',
    nums: 997,
    value: 1,
    price: 50,
    prices: 50,
    imgUrl: green_baterry_IMG
  },
  {
    name: 'bike',
    nums: 996,
    value: 1,
    price: 80,
    prices: 80,
    imgUrl: bike_IMG
  },
  {
    name: 'segway',
    nums: 998,
    value: 1,
    price: 200,
    prices: 200,
    imgUrl: segway_IMG
  },
  {
    name: 'recycling cloth',
    nums: 997,
    value: 1,
    price: 50,
    prices: 50,
    imgUrl: recycling_cloth_IMG
  },

]

function Me(props) {
  const { currentUser } = useAuth();
  const auth = getAuth();

  const handleLogout = async (e) => {
    signOut(auth).then(() => {
      navigate("/login");
    }).catch((error) => {
      // An error happened.
    });
  }

  const handleOrder = async (e) => {
    navigate("/order");

  }

  const [orders, setOrdersList] = useState(order);
  const [counts, setCount] = useState(5);
  const [allPrice, setAllPrice] = useState(430);
  const navigate = useNavigate();
  function sum(arr) {
    return eval(arr.join("+"));
};
  const onReduce = (v, index, orders) => {
    const orderList = JSON.parse(JSON.stringify(orders));
    console.log('click',v,orderList[index],index,orders)
    orderList[index].value = v;
    orderList[index].nums = 999 - v;
    orderList[index].price = orderList[index].prices * v;
    setOrdersList(orderList);
    let count = 0;
    orderList.forEach((item) => {
      count = item.value + count;
    })
    const allPrices= sum(orderList.map(v=>v.price))
   console.log(orderList,'orderList');
    setAllPrice(allPrices);
    setCount(count);
  }

  const meOrderList = [
    { name: 'trees', nums: '120' },
    { name: 'clothes', nums: '20' },
    { name: 'secondhand bikes', nums: '220' },
    { name: 'trees', nums: '120' },
    { name: 'clothes', nums: '20' },
    { name: 'secondhand bikes', nums: '220' },
  ]
  return (
    <div className='me'>
      {currentUser ? (
        <div>
          <div className="order-page">
          <h3 className='me-title'>Personal Info</h3>
            <div className='me-info me-info-view'>
              <img src= {avatar} className="avatar-img"/>
              <p className='me-email'>{currentUser?.email}</p>
            </div>
            <div className='me-info me-total-view'>
              <p >green coins:</p>
              <p className='coins'><span>785</span> Coins</p>
            </div>
            <div className="me-order-list">
            {
                orders.map((item, index) => <OrderItem price={item.price} onReduce={(v) => onReduce(v, index, orders)} onAdd={(v) => onReduce(v, index, orders)} key={index} name={item.name} nums={item.nums} value={item.value} imgUrl={item.imgUrl} />)
              }
                {/* <p className="order-price">
             Total amount : &nbsp;<span>{allPrice}</span>
              </p> */}
              <button className='proceed-btn' onClick={handleOrder}>
                Total amount : <span style={{ fontSize: "1.2em"}}>{allPrice}</span> <br />
                Proceed to checkout {`(${counts} items)`}
              </button>
            </div>
          </div>
          <div className='logout'>
            <div className='logout-box'> 
              <button onClick={handleLogout}>LOGOUT</button>
            </div>
          </div>
        </div>
      ) : (
        <div><h3>Don't have an account? <Link to="/register">Register</Link></h3></div>
      )}
    </div>
  )
}
export default Me;