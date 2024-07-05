import React, { useState }  from "react";
import {Link, useNavigate} from 'react-router-dom';
import {AiOutlineMail} from "react-icons/ai"
import{AiOutlineLock} from "react-icons/ai";
import {AiOutlineUser} from "react-icons/ai";
import bearImage from '../images/bear-gif.gif';
import errorImage from '../images/bear-sad.gif';
import axios from "axios";
const Register=()=>{
    const [inputs,setinputs]=useState({
        username:"",
        email:"",
        password:"",
    });
    const[err,seterror]=useState(null)
    const navigate =useNavigate()
    const handleChange=e =>{
        setinputs(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.username.trim() || !inputs.email.trim() || !inputs.password.trim()) {
            seterror("All fields are required");
            return;
        }
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
            seterror("Invalid email format");
            return;
        }
    
        if (inputs.username.length > 25) {
            seterror("Username should not exceed 25 characters");
            return;
        }
    
        try {
            await axios.post(`${process.env.REACT_APP_URL}/register`, inputs);
            navigate('/login');
        } catch (err) {
            seterror(err.response.data);
        }
    }
    
    
    return(
        
        <>
         <header className="header">
        <div className="header-1">
        <a href="#" className="logo"><i className="fas fa-book"></i>Book</a>
        <div className="icons">
          <div id="search-btn" className="fas fa-search"></div>
          <a href="/"class="fa-solid fa-house-chimney"></a>
          <a href="/cart" className="fas fa-shopping-cart"></a>
          <a href="/wishlist" className="fas fa-heart"></a>
          <Link to="/login"><div id="login-btn" className="fas fa-user"></div></Link>
          <Link to="/adminlogin"><div id="login-btn" className="fas fa-sign-in"></div></Link>
          
        </div>
      </div>
      </header>
    
        <div className="blue-bg">
      <img src={err ? errorImage : bearImage} alt="Bear" />
        <div className="register-auth">     
        
        <div className="form-box">
            <div className="form-value">
                <form >
                <h2 className="register-head">Register</h2>
                <div className="input-box">
                    <AiOutlineUser className="ion-icon"></AiOutlineUser>

                    <input type="email" required name="username"  onChange={handleChange} />
                    <label>User Name</label>
                </div>
                <div className="input-box">
                    <AiOutlineMail className="ion-icon"></AiOutlineMail>

                    <input type="email" required name="email" onChange={handleChange} />
                    <label >Email</label>
                </div>
                <div className="input-box">
                    <AiOutlineLock className="ion-icon"></AiOutlineLock>
                    <input type="password" required  name="password" onChange={handleChange} />
                    <label>Password</label>
                </div>
                {err &&<p>{err}</p>}
               

                
                <button onClick={handleSubmit}>Register</button>
                <div className="register">
                <p>Do have a account?<Link to="/login">Login in</Link></p>
                </div>
                </form>
            </div>
        </div>
        </div>
        </div>
        </>
       
    )
}
export default Register