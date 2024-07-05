import React, { useContext, useEffect ,useState} from 'react'
import axios from 'axios';
import Navbar from "../sections/Navbar";



const Mainbooks = () => {
    const[allbooks,setbooks]=useState('');
    useEffect(()=>{
        getallbooks();
        
    },[])
    const getallbooks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/getallbooks`);
            setbooks(response.data);
            
        } catch (error) {
            console.error(error);
        }
    };
  return (
  <>
  <Navbar>
  </Navbar>
  <section className="feature" id="featured">
                <h1 className="heading">
                    <span>All Books</span>
                </h1>

                <div className="featured-slide">
                    {allbooks && allbooks.map(book => (
                        <div key={book.book_id}>
                            <div className="swiper-slide box">
                
                                <div className="image">
                                    <img src={book.img.startsWith('https') ?book.img : `/upload/${book.img}`} alt=""/>
                                </div>
                                <div className="content">
                                    <h3>{book.heading}</h3>
                                    <div className="price">${book.present_price}<span>${book.actual_price}</span></div>
                                    <a href={`/${book.book_id}`} className="btn" >View Book</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        
  </>
  )
}


export default Mainbooks;
