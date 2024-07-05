import React from 'react'
import { useEffect,useContext } from 'react';
import { useState } from 'react'
import axios from 'axios';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert';
import {v4 as uuid} from 'uuid';





const Feature = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const {currentuser}=useContext(AuthContext);
    const [msgloading,setmsgloading]=useState(false);
    const[quantity,setQuantity]=useState(1);
    const[msg,setmsg]=useState('')
   
    const navigate = useNavigate();

    useEffect(() => {
        getFeature();
        
    }, []);

    const getFeature = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/getfeature`);
            setFeatures(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
        {msgloading && (<Alert message={msg} color="success" />)}
             
      {/* Other content */}
            <section className="featured" id="featured">
                <h1 className="heading">
                    <span>Featured books</span>
                </h1>

                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    loop={true}
                    navigation={true}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, Navigation]}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        450: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                    className="featured-slider"
                >
                    {features.map(book => (
                        <SwiperSlide key={book.book_id}>
                            <div className="swiper-slide box">
                                <div className="icons">
                                    <a href="#" className="fas fa-search"></a>
                                    <a href="#" onClick={()=>addToWishlist(book)} className="fas fa-heart"></a>
                                    <a href={`/${book.book_id}`} className="fas fa-eye"></a>
                                </div>
                                <div className="image">
                                    <img src={book.img.startsWith('https') ?book.img : `/upload/${book.img}`} alt=""/>
                                </div>
                                <div className="content">
                                    <h3>{book.heading}</h3>
                                    <div className="price">${book.present_price}<span>${book.actual_price}</span></div>
                                    <a href="#" className="btn" onClick={()=>addToCart(book)}>add to cart</a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
        </div>
    );
};

export default Feature;
