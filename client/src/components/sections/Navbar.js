import React, { useEffect ,useContext} from 'react';
import {Link} from "react-router-dom"
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate=useNavigate();
  const {currentuser}=useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    const searchForm = document.querySelector('.search-form');
console.log(currentuser);
  }, []);
  
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
};


  return (
    <header className="header">
      <div className="header-1">
        <a href="#" className="logo "><i className="fas fa-book"></i><span className='logo-text'>Book</span></a>

        
        <div className="icons">
          <a href="/wishlist" className="fas fa-heart"></a>
          <a href="/cart" className="fas fa-shopping-cart"></a>
          <Link to="/login"><div id="login-btn" className="fas fa-user"></div></Link>
          <Link to="/adminlogin"><div id="login-btn" className="fas fa-sign-in"></div></Link>
    
          {currentuser && (<a onClick={handleLogout} className='button_a'>Logout</a>)}
        {!currentuser && (<a href='/login' className='button_a' >Login</a>)}
        </div>
      </div>
      <div className="header-2">
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/books/all">Books</a>
          <a href="/freebooksall">FreeBooks</a>
          <a href="/feedback">Feedback</a>
          
        </nav>
      </div>
    </header>
  )
}

export default Navbar;
