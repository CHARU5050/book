import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios';
import { useState,useEffect,useRef } from 'react';
import Navbar from '../sections/Navbar';
import HTMLFlipBook from 'react-pageflip';
import './freebook.css';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/swiper-bundle.css';
import 'swiper/css/effect-flip';


import 'swiper/css/effect-creative';
import { EffectCreative } from 'swiper/modules';


// import required modules
import { EffectCards } from 'swiper/modules';
import { EffectFlip, Pagination, Navigation } from 'swiper/modules';
const Booksliderpage = () => {
  let {id}=useParams();
  const [book,setbook]=useState();
  console.log(id);
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/singlefreebook`, { id });
        const bookData = response.data;
        bookData.imgurl = JSON.parse(bookData.imgurl);
        console.log(bookData);
        setbook(bookData);
      } catch (error) {
        console.error('Error fetching the book:', error);
      }
    };
    fetchBook();
  }, [id]);


  const [selectedOption, setSelectedOption] = useState('bookflip');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(`Selected option: ${event.target.value}`);
  };


 
  return (
    <>
    <Navbar></Navbar>

    <div className="selectoptions-for-book d-flex justify-content-center align-items-center ">
      <select 
        className="form-select text-center" 
        value={selectedOption} 
        onChange={handleChange}
      >
        <option value="bookflip">Bookflip</option>
        <option value="magazine">Magazine</option>
        <option value="cards">Cards</option>
        <option value="onepage">One Page</option>
      </select>
    </div>

    
    {selectedOption==='bookflip' && (<HTMLFlipBook className="flipbook" 
    width={400} 
    height={600} 
    maxShadowOpacity={2}   
    showCover={true}
    mobileScrollSupport={true}
    
    
    >
            {book && book.imgurl.map((img, index) => (
              <div key={`page-${index}`} className='page'>
                <img src={img.startsWith('https') ?img : `/book/${img}`} alt={`Page ${index + 1}`} />
              </div>
            ))}
          </HTMLFlipBook>)}



          {selectedOption==='cards' && (
            <Swiper 
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper selectcard"
          >
            {book &&
    book.imgurl.map((img, index) => (
      <SwiperSlide className='card-page' key={`slide-${index}`}>
        <div className='page'>
          <img src={img.startsWith('https') ?img : `/book/${img}`} alt={`Page ${index + 1}`} />
        </div>
      </SwiperSlide>
    ))}
          </Swiper>
          )}



          
{selectedOption==='onepage' && (
  <div className='onepage-swiper'>
  <Swiper
  effect={'flip'}
  grabCursor={true}
  
  navigation={true}
  modules={[EffectFlip, Pagination, Navigation]}
  className="mySwiper"
>
{book &&
    book.imgurl.map((img, index) => (
      <SwiperSlide  key={`slide-${index}`}>
        <div >
          <img src={img.startsWith('https') ?img : `/book/${img}`} alt={`Page ${index + 1}`} />
        </div>
      </SwiperSlide>
    ))}
  
</Swiper>
</div>

           
          )}



          
    
    {selectedOption==='magazine' && (<HTMLFlipBook className="flipbook" 
    width={400} 
    height={600}   
  
  
    
    
    >
            {book && book.imgurl.map((img, index) => (
              <div key={`page-${index}`} className='page'>
                <img src={img.startsWith('https') ?img : `/book/${img}`} alt={`Page ${index + 1}`} />
              </div>
            ))}
          </HTMLFlipBook>)}












    
    
    
    
    
    </>
  )
}

export default Booksliderpage



