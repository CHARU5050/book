import React, { useContext, useState, useEffect } from 'react';
import Navbar from "../sections/Navbar";
import { AuthContext } from "../../context/authcontext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const { currentuser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [address, setaddress] = useState('');
  const [cart, setcart] = useState([]);
  const [total, settotal] = useState(0);

  useEffect(() => {
    if (!currentuser) {
      navigate('/login');
    }

    getcart();
  }, [currentuser]);

  const getcart = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getcart/${currentuser.iduser}`);
      setcart(response.data);
      const totalAmount = calculateTotal(response.data);
      settotal(totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotal = (cart) => {
    if (!Array.isArray(cart)) {
      return 0;
    }

    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleProceed = async () => {
    try {
      const order = {
        userId: currentuser.iduser,
        items: cart.map(item => ({ bookId: item.idbook, quantity: item.quantity })),
        totalAmount: total,
        address: address,
        // Add other order details as needed
      };
      await axios.post(`${process.env.REACT_APP_URL}/orders`, order);
      // Redirect or show success message
      navigate('/paymentSuccesfull');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <h1 align="center"> PAYMENT PROCESS</h1>
      <div className='payment'>
        <form className='payment_form'>
          <label>Name:</label>
          <input type="text" className='' value={currentuser.username} readOnly></input>
          <label>Email:</label>
          <input type="email" className='' value={currentuser.email} readOnly></input>
          <label> Phone Number</label>
          <input type="number"></input>
          <label>Address:</label>
          <input type='text' value={address} onChange={(e) => setaddress(e.target.value)}></input>
          <label>Total Price</label>
          <input type="number" className='' value={total} readOnly></input>
          <button className='btn' onClick={handleProceed}>Proceed</button>
        </form>
      </div>
    </div>
  )
}

export default Payment;
