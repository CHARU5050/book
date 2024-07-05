import React, { useEffect, useState } from 'react';
import Adminpage from './Adminpage';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState('');

  useEffect(() => {
    fetchOrders();
    console.log(orders);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getorders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <>
      <Adminpage/>
      <div className='col-lg-10 ms-auto'>
      <div className="card border-0 shadow m-4">
      <div className="card-body">
          <h1>Orders</h1>
          <table className='table'>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Books</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Address</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orders &&orders.map(order => (
                <tr key={order.id}>
                  <td>{order.userId}</td>
                  <td>{order.books}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.address}</td>
                  <td><button>Delivered</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        </div>
    
    </>
  );
};

export default Order;
