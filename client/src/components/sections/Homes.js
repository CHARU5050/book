import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Homes = () => {
  const [homepage, setHome] = useState([]);

  useEffect(() => {
    getHomepage();
  }, []);

  const getHomepage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/gethomepage`);
      setHome(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <section className="home" id="home">
        <div className="row">
          <div className="content">
            {homepage.length > 0 && (
              <>
                <h3>{homepage[0].heading}</h3>
                <p>
                  {homepage[0].description}
                </p>
                <a href="/books/all" className="btn">
                  shop now
                </a>
              </>
            )}
          </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
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
            className="books-slider"
          >
            <SwiperSlide>
              <img src="/images/book4.jpg" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/book1.jpg" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/book6.jpg" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/book8.jpg" alt="" />
            </SwiperSlide>
            <div className="stand"></div>
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Homes;
