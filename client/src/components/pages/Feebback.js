import React ,{useState,useContext,useEffect} from 'react'
import './Feebback.css';
import Navbar from "../sections/Navbar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "../../context/authcontext";
const Feebback = () => {
  const navigate=useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [rating, setRating] = useState(0);
    const { currentuser } = useContext(AuthContext);
    const [feedback, setFeedback] = useState('');



    const handleSubmit = async () => {
      try {
        const userid=currentuser.username;
        await axios.post(`${process.env.REACT_APP_URL}/feedback`, { feedback, rating,userid });
        alert('Feedback submitted successfully');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback');
      }
    };


    useEffect(() => {
      if (!currentuser) {
        navigate('/login');
      }

    }, [currentuser]);
    const toggleTextarea = () => {
        setIsActive(!isActive);
      };

  return (
    <>
    <Navbar></Navbar>
    <div className='feebback'>
        <div className='container'>
            <div className='wrapper'>
                <p class='text'> How would You Rate this App?</p>
                <div className='emoji'  onClick={toggleTextarea}>
                <div onClick={() => setRating(1)}>😣</div>
              <div onClick={() => setRating(2)}>😐</div>
              <div onClick={() => setRating(3)}>🙂</div>
              <div onClick={() => setRating(4)}>😆</div>
              <div onClick={() => setRating(5)}>😍</div>

                </div>

            </div>

            {isActive && (
                <div>
            <textarea
              className='textarea'
              cols='30'
              rows='3'
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder='Write your opinion!'
            ></textarea>
        <a className='btn' onClick={handleSubmit}>Submit</a>
            </div>
          )}

        
        </div>

        </div>
    </>
  )
}

export default Feebback