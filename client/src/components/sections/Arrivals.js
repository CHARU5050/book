import React from 'react'
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useState,useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Arrivals = () => {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getArrivals();
  }, []);

  const getArrivals = async () => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/getarrival`);
          setArrivals(response.data);
          setLoading(false);
      } catch (error) {
          console.error(error);
          setLoading(false);
      }
  };

  if (loading) {
      return <div>Loading...</div>;
  }

  return (
      <div>
          <section className="arrivals" id="arrivals">
              <h1 className="heading"><span>New arrivals</span></h1>
              <Swiper
                  loop={true}
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
                      768: {
                          slidesPerView: 2,
                      },
                      1024: {
                          slidesPerView: 3,
                      },
                  }}
                  className="arrivals-slider"
              >
                  {arrivals.map(book => (
                      <SwiperSlide key={book.book_id}>
                          <a href="#" className="swiper-slide box">
                              <div className="image">
                                  <img src={book.img.startsWith('https') ?book.img : `/upload/${book.img}`} alt=""/>
                              </div>
                              <div className="content">
                                  <h3>{book.heading}</h3>
                                  <div className="price">${book.present_price}<span>${book.actual_price}</span></div>
                                  <a href={`/${book.book_id}`}  className="btn">View</a>
                              </div>
                          </a>
                      </SwiperSlide>
                  ))}
              </Swiper>
          </section>
      </div>
  );
};

export default Arrivals;