import React, { useEffect, useState } from 'react';
import Adminpage from './Adminpage';
import axios from 'axios';

const ManageBook = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get(`${process.env.REACT_APP_URL}/readingbooks`)
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${process.env.REACT_APP_URL}/deletefreebooks/${id}`)
      .then(response => {
        console.log(response.data.message);
        fetchBooks();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <Adminpage />
      <div className='col-lg-10 ms-auto'>
        <h1> ManageBook</h1>
        <section className="blogs" id="blogs">
          <div className="blogs-slider">
            {books.map((book) => (
              <div className="box" key={book.id}>
                <div className="image">
                  <img src={book.imgurl.startsWith('https') ?book.imgurl : `book/${book.imgurl}`} alt={book.bookname} />
                </div>
                <div className="content">
                  <h3>{book.bookname}</h3>
                  <button onClick={() => handleDelete(book.id)} className="btn">Delete this Book</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ManageBook;
