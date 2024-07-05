import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const AuthContext=createContext()

export const AuthcontextProvider=({children})=>{
    const [currentuser,setcurrentuser]=useState(JSON.parse(localStorage.getItem("user"))||null)
    const [admin_details,setadmindetails]=useState(JSON.parse(localStorage.getItem("admin"))||null)
    
    const login=async(inputs)=>{
        console.log("hello")
        const res=await axios.post(`${process.env.REACT_APP_URL}/login`,inputs);
        setcurrentuser(res.data);

    }
    const adminlogin=async(inputs)=>{
        const res=await axios.post(`${process.env.REACT_APP_URL}/adminlogin`,inputs);
        setadmindetails(res.data);

    }
    const adminlogout=async ()=>{
        await axios.post(`${process.env.REACT_APP_URL}/adminlogout`);
        setadmindetails(null)
        console.log(admin_details);
    }
   
    const logout=async ()=>{
        await axios.post(`${process.env.REACT_APP_URL}/logout`);
        setcurrentuser(null)
    }
    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(currentuser))

    },[currentuser]);
    useEffect(()=>{
        localStorage.setItem("admin",JSON.stringify(admin_details));

    },[admin_details]);
    return(
        <AuthContext.Provider value={{currentuser,login,logout,adminlogin,adminlogout,admin_details}}>
            {children}
        </AuthContext.Provider>
    )

}
