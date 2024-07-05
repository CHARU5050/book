import Navbar from "../sections/Navbar";
import React, { useContext, useEffect ,useState} from 'react'
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import axios from 'axios';
import Alert from '../Alert';
const Wishlist = () => {
  const {currentuser}=useContext(AuthContext);
  const[Wishlist,setwishlist]=useState([]);
  const navigate = useNavigate();
  const[msgloading,setmsgloading]=useState(false);
  const[msg,setmsg]=useState('');
  const[color,setcolor]=useState('success');
  useEffect(()=>{
    if(!currentuser){
      navigate('/login');
    }
    getwishlist();
    
   
  },[currentuser])


  const getwishlist = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getwishlist/${currentuser.iduser}`);
      setwishlist(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletewishlist = (bookid) => {
    const userid = currentuser.iduser;
    axios.delete(`${process.env.REACT_APP_URL}/deletewishlist/${userid}/${bookid}`)
      .then(response => {
        console.log("remove successfully");
        getwishlist();
      })
      .catch(error => {
        console.error('Error deleting item from cart:', error);
      });
   
  };


  const handleQuantityChange = async (bookid, newQuantity) => {

    console.log(bookid, newQuantity);

    try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/singlebooks/${bookid}`);
        if (response.status === 200) {
            const availableQuantity = response.data[0].quantity; // Assuming 'quantity' is the column name in your 'all_books' table
            if (newQuantity <= availableQuantity) {
                try {
                    const updateResponse = await axios.put(`${process.env.REACT_APP_URL}/updatewishlist/${bookid}/${currentuser.iduser}`, { newQuantity });
                    if (updateResponse.status === 200) {
                        console.log("success");
                    }
                } catch (updateError) {
                    console.error('Error updating quantity:', updateError);
                }
            } else {
              setmsgloading(true);
              setmsg(`Only ${availableQuantity} items available.`)
              setcolor('warning');
            }
        }
        getwishlist();
    } catch (error) {
        console.error('Error getting book quantity:', error);
    }
};


  return (
    <>
    <Navbar></Navbar>
    {msgloading && (<Alert message={msg} color={color} />)}
    <table className='carttable'>
      <thead className='cartheader'>
        <tr>
          <th>Products</th>
          <th>Title</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>View</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody className='carttb'>
          {Wishlist.length!=0 && Wishlist.map(item => (
            <tr className='cartrow' key={item.idcart}>
              <td><img src={item.img.startsWith('https') ?item.img : `/upload/${item.img}`} alt=""/></td>
              <td>{item.heading}</td>
              <td>${item.price}</td>
              <td className='align'>
              <div className="quantity-input"><button onClick={()=>{handleQuantityChange(item.idbook,item.quantity-1)}} disabled={item.quantity === 1}>-</button>
            <input
                type="number"
                value={item.quantity}
                min={1}
                
                readOnly
            />
            <button  onClick={()=>{handleQuantityChange(item.idbook,item.quantity+1)}} >+</button> </div></td>
              <td>${item.price * item.quantity}</td>
              <td className='align'><a href={`/${item.idbook}`} className="fa-solid fa-eye"></a></td>
              <td className='align'><a onClick={()=>deletewishlist(item.idbook)} className="fa-solid fa-xmark"></a></td>
            </tr>
          ))}
          
      </tbody>
    </table>
    {Wishlist.length===0 && (<img className='cart_empty' src='/images/cart.jpeg'></img>)} 
    </>
  )
}

export default Wishlist