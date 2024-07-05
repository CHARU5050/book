import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Blogs = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/readingbooks`)
      .then(response => {
        
        setBooks(response.data);
       
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <section className="blogs" id="blogs">
      <h1 className="heading"><span>FreeBooks</span></h1>
      <div className="blogs-slider">
        {books.map((book) => (
          <div className="box" key={book.id}>
            <div className="image">
              <img src={book.imgurl.startsWith('https') ?book.imgurl : `book/${book.imgurl}`} alt={book.bookname} />
            </div>
            <div className="content">
              <h3>{book.bookname}</h3>
              <a href={`/freebooks/${book.id}`} className="btn">Read this Book</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Blogs;
