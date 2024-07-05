import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios';
import Adminpage from './Adminpage';
import {v4 as uuid} from 'uuid';

const AllBooks = () => {
  const [allbooks,setallbooks]=useState("");
  const [bookheading, setbookheading] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [presentPrice, setPresentPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [genre,setGenre]=useState('');
  const [bookdescription, setbookdescription] = useState('');
  const [file1,setfile1]=useState(null);
  useEffect(() => {
    
    getallbooks();
    console.log(allbooks);

  }, []);


  const upload1 =async()=>{
    try{
        const formdata=new FormData();
        console.log(file1)
        formdata.append("file",file1)
        console.log(formdata);
        const res=await axios.post(`${process.env.REACT_APP_URL}/upload`,formdata)
       
        return res.data


    }catch(err){

    }
}


  const getallbooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getallbooks`);
      setallbooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleallbooksubmit = async (e) => {
    e.preventDefault();
    if (!bookheading || !actualPrice || !presentPrice || !quantity || !bookdescription) {
      alert('Please fill in all fields for Feature.');
      return;
    }
    if (quantity === 0) {
      alert('Quantity cannot be 0 for Feature.');
      return;
    }
    const imgurl=await upload1();
    if(!imgurl){
      alert("img is empty")
      return;
    }
    axios.post(`${process.env.REACT_APP_URL}/allbooks`, {
      id:uuid(),
      heading: bookheading,
      actualPrice: actualPrice,
      presentPrice: presentPrice,
      quantity: quantity,
      img:imgurl,
      description: bookdescription,
      genre:genre,
      
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));

    getallbooks();
  };


  const handleDeleteallbooks = (id) => {
    axios.delete(`${process.env.REACT_APP_URL}/deleteallbooks/${id}`)
      .then(response => {
        console.log(response.data.message);
        getallbooks();
      
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (

    <>
    <Adminpage></Adminpage>
    <div className='col-lg-10 ms-auto'>
    
    <div className="card border-0 shadow m-4">
                <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="card-title m-0">ALL BOOKS</h2>
                        <button type="button" className=" btn-dark" data-bs-toggle="modal" data-bs-target="#feature-page" >Add</button>
                    </div>

{allbooks.length==0  && (<p>Need to add books</p>)}

{allbooks.length > 0 && (
  <table>
  <thead>
    <tr>
    <th>Image</th>
      <th>Heading</th>
      <th>Actual Price</th>
      <th>Present Price</th>
      <th>Quantity</th>
       <th>Delete</th>
    </tr>
  </thead>
  <tbody>
    {allbooks.map((item, index) => (
      <tr key={index}>
        <td><img src={item.img.startsWith('https') ?item.img : `./upload/${item.img}`}/></td>
        <td>{item.heading}</td>
        <td>{item.actual_price}</td>
        <td>{item.present_price}</td>
        <td>{item.quantity}</td>
        <td><button className='delete' onClick={() => handleDeleteallbooks(item.book_id)}>Delete</button></td>
      </tr>
    ))}
  </tbody>
</table>
)}
</div>
</div>


<div className="modal fade" id="feature-page" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <form id="general_s_form">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">ADD BOOKS</h2>
                            </div>
                            <div className="modal-body">

                            <div class="mb-3">
  <label className='admin_label' class="form-label">Heading</label>
  <input type="text" class="form-control" id="exampleFormControlInput1"  value={bookheading} onChange={(e) => setbookheading(e.target.value)} />
</div>

<div class="mb-3">
  <label className='admin_label' class="form-label">Actual Price</label>
  <input type="number" class="form-control" value={actualPrice} onChange={(e) => setActualPrice(e.target.value)} id="exampleFormControlInput1"/>
</div>
<div class="mb-3">
  <label className='admin_label' class="form-label">Present Price</label>
  <input type="number" class="form-control"  value={presentPrice} onChange={(e) => setPresentPrice(e.target.value)} id="exampleFormControlInput1"/>
</div>
<div class="mb-3">
  <label className='admin_label' class="form-label">Quantity</label>
  <input type="number" class="form-control"  value={quantity} onChange={(e) => setQuantity(e.target.value)} id="exampleFormControlInput1"/>
</div>
<div className="mb-3">
  <label className='admin_label' class="form-label">Genre</label>
  <select className="form-control" value={genre} onChange={(e) => setGenre(e.target.value)}>
    <option value="">Select Genre</option>
    <option value="Fantasy">Fantasy</option>
    <option value="Comedy">Comedy</option>
    <option value="Mystery">Mystery</option>
    <option value="Children">Children</option>
    <option value="Novel">Novel</option>
    <option value="Business">Business</option>
    <option value="Non-Fiction">Non-Fiction</option>
    <option value="Fiction">Fiction</option>
    <option value="Other">Other</option>
  </select>
</div>

<div class="mb-3">
<label for="formFile" class="form-label">File</label>
  <input class="form-control" type="file" id="formFile" onChange={e=>setfile1(e.target.files[0])}/>
</div>
<div class="mb-3">
  <label className='admin_label' for="exampleFormControlTextarea1" class="form-label">Descriptions</label>
  <textarea class="form-control admin_form" id="exampleFormControlTextarea1" rows="3" value={bookdescription} onChange={(e) => setbookdescription(e.target.value)}></textarea>
</div>
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn text-secondary shadow-none" data-bs-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-dark text-white shadow-none"  data-bs-dismiss="modal"  onClick={handleallbooksubmit}>SUBMIT</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </div>
    </>
  )
}

export default AllBooks