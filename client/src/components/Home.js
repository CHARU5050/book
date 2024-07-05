import React, { useContext, useEffect }  from "react";
import { AuthContext } from "../context/authcontext";
import {Link, useNavigate} from 'react-router-dom';
import "./Home.css";
import Navbar from "./sections/Navbar";
import Homes from "./sections/Homes";
import Iconscontainer from "./sections/Iconscontainer";
import Feature from './sections/Feature'
import NewLetter from './sections/Newletter'
import Arrivals from './sections/Arrivals'
import Deal from './sections/Deal'
import Review from './sections/Reviews'
import Blogs from "./sections/Blogs"
import Footer from './sections/Footer';


function Home(){
    const navigate =useNavigate()
    const {currentuser}=useContext(AuthContext)
    console.log("react link ",process.env.REACT_APP_URL);
      
    return(<div>
    <Navbar></Navbar>
    <Homes></Homes>
    <Iconscontainer></Iconscontainer>  
    <Feature></Feature>  
    <NewLetter></NewLetter>
    <Arrivals></Arrivals>
    
    <Deal></Deal>
    <Review></Review>
    <Blogs></Blogs>
    <Footer></Footer>


   


    </div>)
}
export default Home;