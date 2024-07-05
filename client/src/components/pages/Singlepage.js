import React, { useContext,useEffect, useState } from 'react'
import { AuthContext } from "../../context/authcontext";
import './Singlepage.css';
import Navbar from "../sections/Navbar";
import { useParams } from 'react-router-dom';
import '../styles/stars.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../Alert';
import {v4 as uuid} from 'uuid';



const Singlepage = () => {
  let { id } = useParams();
  const[book,setbook]=useState("");
  const {currentuser}=useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const[com,setcomment]=useState('');
  const [quantity,setQuantity]=useState(1);
  const[msgloading,setmsgloading]=useState(false);
  const[msg,setmsg]=useState('');
  const[color,setcolor]=useState('success');
  const [averagerating,setavergeratings]=useState('');
  const[numberofuser,setusernumber]=useState(0);
 useEffect(()=>{


  getbooks();
  getcomments();
  getratings();
  

  
 },[])

  const getbooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/singlebooks/${id}`);
      setbook(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getcomments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getcomments/${id}`);
      setcomment(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deletecomments = (commentId) => {
    axios.delete(`${process.env.REACT_APP_URL}/deletecomments/${commentId}`)
      .then(response => {
       getcomments();
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
      });
  };
  

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!currentuser) {
      navigate("/login");
      return;
    }
  

    try {
   
      await axios.post(`${process.env.REACT_APP_URL}/comments`, {
        bookid: id,
        userid: currentuser.iduser, 
        ratings: rating,
        comment: comment,
        date: date
      });

      setComment('');
      setRating(0);
      getcomments();
    } catch (error) {
      console.error(error);
    }
  };

  const getratings = async () => {
    try {
      if(book.length!=0){
      const response = await  axios.get(`${process.env.REACT_APP_URL}/book/${book[0].book_id}/rating`)
      const { averageRating, numUsersRated } = response.data;
      setavergeratings(averageRating);
      setusernumber(numUsersRated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return `${diffMinutes} min ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.ceil(diffDays / 30);
      return `${diffMonths} months ago`;
    } else {
      const diffYears = Math.ceil(diffDays / 365);
      return `${diffYears} years ago`;
    }
  };


  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
        if (prevQuantity < book[0].quantity) {
            return prevQuantity + 1;
        }
        return prevQuantity;
    });
   
};

const handleDecrement = () => {
    setQuantity((prevQuantity) => {
        if (prevQuantity > 1) {
            return prevQuantity - 1;
        }
        return prevQuantity;
    });
};

const addToCart = async (book) => {

  if(!currentuser){
      navigate('/');
      
  }
  try {
      await axios.post(`${process.env.REACT_APP_URL}/addtocart`, {
          id:uuid(),
          userid:currentuser.iduser,
          bookid:book.book_id,
          heading:book.heading,
          img:book.img,
          price: book.present_price,
          quantity:quantity,
          totalquantity:book.quantity

      });
   
      setmsgloading(true);
      setmsg("Book addded to cart succesfully!");
  } catch (error) {
      console.error(error);
      alert('Failed to add book to cart');
  }
};


const addToWishlist = async (book) => {

  if(!currentuser){
      navigate('/');
      
  }
  const userid = currentuser.iduser;
  try {
      await axios.post(`${process.env.REACT_APP_URL}/addtowishlist`, {
          id:uuid(),
          userid:currentuser.iduser,
          bookid:book.book_id,
          heading:book.heading,
          img:book.img,
          price: book.present_price,
          quantity:1,

      });
      setmsgloading(true);
      setmsg("Book addded to wishlist succesfully!");
  
  } catch (error) {
      console.error(error);
      alert('Failed to add book to cart');
  }
};




  return (
    <>
    <Navbar></Navbar>
    {msgloading && (<Alert message={msg} color={color} />)}
    <div className='singlepage'>
    {book.length !== 0 && (
    <div className='single-page'>

        <div className='img_section'>
            <img src={book[0].img.startsWith('https') ?book[0].img : `upload/${book[0].img}`} alt={book[0].heading}></img>
        </div>
        <div className='container_section'>
            <h1>{book[0].heading}</h1>
            <p className="starability-result" data-rating={averagerating}>
               {averagerating}
            </p>
            <p>({numberofuser})</p>
            <div className="price">${book[0].present_price}<span>${book[0].actual_price}</span></div>
            <p>{book[0].description}</p>
            <div className="quantity-input">
            <label className="quantity-label">Quantity:</label>
            <button onClick={handleDecrement} disabled={quantity === 1}>-</button>
            <input
                type="number"
                value={quantity}
                min={1}
                max={book[0].quantity}
                readOnly
            />
            <button onClick={handleIncrement} disabled={quantity === book.quantity}>+</button>
        </div>
            <a onClick={()=>{addToCart(book[0])}} className="btn">Add to cart</a>
        </div>
    </div>
    )}
</div>

    

   
    <div className='ratings_form'>
      <h1>Comments Sections</h1>
      <h3> Give Ratings</h3>
      <fieldset className="starability-heart">
          <input type="radio" id="no-rate" className="input-no-rate" name="rating" value="0" checked={rating === 0} aria-label="No rating." onChange={handleRatingChange} />
          <input type="radio" id="first-rate1" name="rating" value="1" checked={rating === 1} onChange={handleRatingChange} />
          <label htmlFor="first-rate1" title="Terrible">1 star</label>
          <input type="radio" id="first-rate2" name="rating" value="2" checked={rating === 2} onChange={handleRatingChange} />
          <label htmlFor="first-rate2" title="Not good">2 stars</label>
          <input type="radio" id="first-rate3" name="rating" value="3" checked={rating === 3} onChange={handleRatingChange} />
          <label htmlFor="first-rate3" title="Average">3 stars</label>
          <input type="radio" id="first-rate4" name="rating" value="4" checked={rating === 4} onChange={handleRatingChange} />
          <label htmlFor="first-rate4" title="Very good">4 stars</label>
          <input type="radio" id="first-rate5" name="rating" value="5" checked={rating === 5} onChange={handleRatingChange} />
          <label htmlFor="first-rate5" title="Amazing">5 stars</label>
        </fieldset>
<div className='comment_review'>
<textarea
            className="form-control"
            placeholder="Add Comments......"
            value={comment}
            onChange={handleCommentChange}
            rows="3"
          ></textarea>

<button className='btn ' onClick={handleSubmit}>Add Comments</button>
</div>


<div className='comments_section_all'>
        {com && com.map((comment) => (
          <div className='each_comments' key={comment.idcomments}>
            <div className='time_user'>
              <div className='username'>
                <img src="images/user.png" alt="User"></img>
                <h5>{comment.username}</h5>
              </div>
              <div className='time'>
                {formatDate(comment.date)}
                {comment.userid ==currentuser.iduser && (
                  <div className='op_time'>
                    <a className='fa fa-edit'></a>
                    <a className='fa-solid fa-trash' style={{ color: "red" }}  onClick={() => deletecomments(comment.idcomments)} ></a>
                  </div>
                )}
              </div>
            </div>
            <div className='rating_each'>
  <p className="starability-result comments_stars" data-rating={comment.ratings}>
    Rated: {comment.ratings} stars
  </p>
  <p className="comment_des">{comment.comment}</p>
</div>

           
          </div>
        ))}
      </div>
      </div>
    </>
  )
}

export default Singlepage