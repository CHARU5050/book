import React, { useState ,useContext, useEffect} from 'react';
import './Adminpage.css';
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Adminlogin from './Adminlogin.js';
const Adminpage = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
    const {admin_details,adminlogout}=useContext(AuthContext);
    const navigate=useNavigate();

    useEffect(()=>{
        if(!admin_details){
            navigate('/adminlogin');
        }
        
        console.log(admin_details);
     
    },[])
    
    const handleLogout= async()=>{
        await adminlogout();
        navigate('/adminlogin');

    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2 bg-dark border-top border-secondary border-3" id="dashboard-menu">
                        <nav className="navbar navbar-expand-lg navbar-light rounded shadow">
                            <div className="container-fluid flex-lg-column align-items-stretch">
                                <h1 className="mt-2 text-white"> ADMIN PANEL</h1>
                                <div className="collapse navbar-collapse flex-column align-items-stretch" id="adminDropdown">
                                    <ul className="nav nav-pills flex-column">
                                        <li className="nav-item">
                                        <Link to ="/admin_page"><button className='admin-button' >Dashboard</button></Link>
                                        </li>
                                    <li className="nav-item">
                                        <Link to ="/allbooks"><button className='admin-button' >All Books</button></Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link to ="/admin_page/orders"><button className='admin-button' >Orders</button></Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link to ="/admin_page/freebooks"> <button className='admin-button' >Free Books</button></Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link to ="/managefreebook"><button className='admin-button' >Manage Freebook</button></Link>
                                        </li>

                                        <li className="nav-item">
                                        <Link to ="/admin_page/others">  <button className='admin-button' >Settings</button></Link>
                                        </li>
                                        <li className="nav-item">
                                          <Link><button onClick={handleLogout} className='admin-button' > Logout</button></Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className='col-lg-10 ms-auto'>
                 
                    </div>
                </div>
            </div>
        </>
    );
}

export default Adminpage;
