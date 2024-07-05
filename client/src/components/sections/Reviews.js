import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/feedbackget`)
      .then(response => {
        setFeedback(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div>
      <section className="reviews" id="reviews">
        <h1 className="heading"><span>client's reviews</span></h1>
        <div className="reviews-slider">
          <div className="wrapper">
            {feedback.map(review => (
              <div className="box" key={review.idfeebback}>
                <img src="images/user.png" alt={review.username} />
                <h3>{review.username}</h3>
                <p>{review.feedback}</p>
                <div className="stars">
                  {[...Array(review.ratings)].map((star, index) => (
                    <i key={index} className="fa fa-star"></i>
                  ))}
                  {[...Array(5 - review.ratings)].map((star, index) => (
                    <i key={index} className="fa fa-star-half-alt"></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reviews;
