import React, { useEffect, useState } from 'react';
import Adminpage from './Adminpage';
import './Freebook.css';
import HTMLFlipBook from 'react-pageflip';
import axios from 'axios';
import {BarLoader} from 'react-spinners';

const FreeBooks = () => {
    const[img,setimgurl]=useState();
    const [file, setFile] = useState(null);
    const[pdfdetails,setpdf]=useState(null);
    const [bookName, setBookName] = useState('');
    const[pages,setpages]=useState([]);
    const[loading ,setloading]=useState(false);
    const [requestId,setrequest]=useState();
    const [books,setbook]=useState();
    const[preview,setpreview]=useState(false);

    const handleDragover = (e) => {
        e.preventDefault();
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    const handleClearfile = () => {
        setFile(null);
    }
      
    const handlepdfSubmit = async (e) => {
      e.preventDefault();
    
      if (!bookName || !file) {
        alert('Please fill in all fields for Feature.');
        return;
      }
    
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          setloading(true);
                 const res = await axios.post(`${process.env.REACT_APP_URL}/addBookToMainPage`, formData);
          const { requestId } = res.data;
          console.log(`PDF conversion started with requestId: ${requestId}`);
         
          localStorage.setItem('requestId', requestId);
          localStorage.setItem('bookname',bookName);
         
    
    
        } catch (error) {
          console.error('Error uploading and converting PDF:', error);
          alert('Error uploading and converting PDF: ' + error.message);
          setloading(false);
        }
        
      }
    };


    useEffect(() => {
      const temp = localStorage.getItem('requestId');
      const bookname =localStorage.getItem('bookname');
      if (temp && bookname) {
        setloading(true);
        setTimeout(async () => {
          try {
            const response = await axios.put(`${process.env.REACT_APP_URL}/freebook`, {bookName: bookname,id:temp });
            console.log(response.data);
            const bookData = response.data;
            bookData.imgurl = JSON.parse(bookData.imgurl); 
            setbook(bookData);
            console.log(bookData);
            setpreview(true);
            
          } catch (err) {
            console.log('Error updating book details');
            console.error(err);
          }
       finally {
            setloading(false);
            
            
            localStorage.removeItem('requestId')
            localStorage.removeItem('bookname')

          }
        }, 20000); // 10 seconds timeout
      }
    }, [bookName]);
    

    return (
        <div className='freebook'>
            <Adminpage></Adminpage>
            <div className='col-lg-10 ms-auto'>
                <div className='wholepage'>
                    <div className='formpage'>
                        <div className='box'>
                            <h2 className="header">
                                ADD PDF
                            </h2>

                            <input type='text' className='drop-file-textinput' placeholder='Enter the book name :' value={bookName} onChange={(e) => setBookName(e.target.value)}></input>
                            <div className='uploading'>
                                {!file ? (
                                    <div className="drop-file-input">
                                        <div className="drop-file-input__label">
                                            {!loading && ( <img src='\images\cloud-upload-regular-240.png' alt="" />)}
                                            {loading && (<p>loading...</p>)}
                                            <p>Drag & Drop your files here</p>
                                        </div>
                                        <input type="file" accept=".pdf" value="" onChange={handleDragover} />
                                    </div>

                                ) : (<div class="custom-container">
                                    <div class="custom-wrapper">
                                        <div class="custom-content">
                                            <span class="custom-text">File Name: </span>
                                            {file.name}
                                        </div>
                                        <button class="custom-button" onClick={handleClearfile}>X</button>
                                    </div>
                                </div>
                                    )
                                }


                            </div>

                            <button className='btn' onClick={handlepdfSubmit}> Add to main Page</button>


                        </div>

                    </div>
                    <div>{loading && (<div className='loading'> <BarLoader color="#0d9db3" /></div>)}</div>
                    {!loading &&preview && books && (
        <div className='preview'>
          <h1>Preview</h1>
          <HTMLFlipBook className="flipbook" width={340} height={500}>
            {books.imgurl.map((img, index) => (
              <div key={`page-${index}`} className='page'>
                <img src={img.startsWith('https') ?img : `/book/${img}`} alt={`Page ${index + 1}`} />
              </div>
            ))}
          </HTMLFlipBook>
        </div>)}

                </div>
            </div>
        </div>

    )
}

export default FreeBooks;
