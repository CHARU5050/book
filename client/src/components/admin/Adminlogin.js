import React, {useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { AuthContext } from "../../context/authcontext";

const Adminlogin = () => {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const {adminlogin}=useContext(AuthContext);
    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (!inputs.username.trim() || !inputs.password.trim()) {
            setErr("All fields are required");
            return;
        }
        try {
            await  adminlogin(inputs)
            navigate('/admin_page'); // Redirect to the dashboard after successful login
        } catch (err) {
            console.log(err);
        }
    }

    return (
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
      <div className="adminmobile">
        Use Website for better experience
      </div>
      <div className="adminloginpage">

        <div className="blue-bg">
            <img src={err ? "/images/bear-sad.gif": "/images/bear-gif.gif"} alt="Bear" />
            <div className="register-auth">
                <div className="form-box">
                    <div className="form-value">
                        <form>
                            <h2 className="register-head">Admin Login</h2>
                            <div className="input-box">
                                <AiOutlineUser className="ion-icon" />
                                <input type="text" required name="username" onChange={handleChange} />
                                <label>User Name</label>
                            </div>
                            <div className="input-box">
                                <AiOutlineLock className="ion-icon" />
                                <input type="password" required name="password" onChange={handleChange} />
                                <label>Password</label>
                            </div>
                            {err && <p>{err}</p>}
                            <button onClick={handleSubmit}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default Adminlogin;
