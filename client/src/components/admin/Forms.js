import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import {v4 as uuid} from 'uuid';

import Adminpage from './Adminpage';
const Forms = () => {
  const [home, setHome] = useState({ heading: '', paragraph: '' });
  const [featureHeading, setFeatureHeading] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [presentPrice, setPresentPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [genre,setGenre]=useState('');
  const [arrivalgenre,setarrivalsgenre]=useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [arrivalHeading, setArrivalHeading] = useState('');
  const [arrivalActualPrice, setArrivalActualPrice] = useState('');
  const [arrivalPresentPrice, setArrivalPresentPrice] = useState('');
  const [arrivalQuantity, setArrivalQuantity] = useState('');
  const [arrivalDescription, setArrivalDescription] = useState('');
  const [file1,setfile1]=useState(null);
  const [file2,setfile2]=useState(null);
  const [features,setfeatures]=useState("");
  const [homepage,sethome]=useState([{ heading: '', description: '' }]);
  const [arrivals,setarrivals]=useState("");
  const ids = [];
  

  useEffect(() => {
    
    getfeature();
    getarrival();
    gethomepage();
 
 
    
  }, [homepage,features,arrivals]);

  const gethomepage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/gethomepage`);

      sethome(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  


  const getfeature = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getfeature`);
      setfeatures(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getarrival = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getarrival`);
      setarrivals(response.data);
    } catch (error) {
      console.error(error);
    }
  };



  const upload1 =async()=>{
    try{
        const formdata=new FormData();
        console.log(file1)
        formdata.append("file",file1)
        console.log(formdata);
        const res=await axios.post(`${process.env.REACT_APP_URL}/upload`,formdata)
       
        return res.data


    }catch(err){
      console.log(err);

    }
}
const upload2 =async()=>{
  try{
      const formdata=new FormData();
      formdata.append("file",file2)
      const res=await axios.post(`${process.env.REACT_APP_URL}/upload`,formdata)
      return res.data;
  }
  catch(err){
    console.log(err);

  }
}



  const handleHomeSubmit = (e) => {
    e.preventDefault();
    if (!home.heading || !home.paragraph) {
      alert('Please fill in all fields for Home.');
      return;
    }
    axios.post(`${process.env.REACT_APP_URL}/home`, {
      heading: home.heading,
      paragraph: home.paragraph,
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));
  };

 

const handleFeatureSubmit = async (e) => {
  e.preventDefault();
  if (!featureHeading || !actualPrice || !presentPrice || !quantity || !featureDescription) {
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
  axios.post(`${process.env.REACT_APP_URL}/feature`, {
    id:uuid(),
    heading: featureHeading,
    actualPrice: actualPrice,
    presentPrice: presentPrice,
    quantity: quantity,
    img:imgurl,
    description: featureDescription,
    genre:genre,
    
  })
  .then(response => console.log(response))
  .catch(error => console.error(error));
};


  const handleArrivalSubmit = async (e) => {
    e.preventDefault();
    console.log(arrivalgenre)
    if (!arrivalHeading || !arrivalActualPrice || !arrivalPresentPrice || !arrivalQuantity || !arrivalDescription) {
      alert('Please fill in all fields for Arrival.');
      return;
    }
    if (arrivalQuantity === 0) {
      alert('Quantity cannot be 0 for Arrival.');
      return;
    }
      const imgurl= await upload2();
    if(!imgurl){
      alert("img is empty")
      return;
    }


    axios.post(`${process.env.REACT_APP_URL}/arrival`, {
      id:uuid(),
      heading: arrivalHeading,
      actualPrice: arrivalActualPrice,
      presentPrice: arrivalPresentPrice,
      quantity: arrivalQuantity,
      img:imgurl,
      description: arrivalDescription,
      arrivalgenre:arrivalgenre
 
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));
  };

  const handleDeletecategory = (id) => {
    axios.delete(`${process.env.REACT_APP_URL}/deletecategory/${id}`)
      .then(response => {
        console.log(response.data.message);
        getfeature();
      
      })
      .catch(error => {
        console.error(error);
      });
  };


  
  const handleEdit = () => {
    setHome({heading:homepage[0].heading,paragraph:homepage[0].description})
}
  




  return (
    <>
    <Adminpage></Adminpage>
    <div className='col-lg-10 ms-auto'>
    <div className='homedetails'>
       <div className="card border-0 shadow m-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="card-title m-0">HOME PAGE</h2>
                        <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#home-page" onClick={handleEdit} >Edit</button>
                    </div>
                    <h3 className="card-subtitle mb-1 fw-bold">Heading</h3>
                    <p className="card-text" id="site_title">{homepage[0].heading}</p>
                    <h3 className="card-subtitle mb-1 fw-bold">Paragraph in Home page</h3>
                    <p className="card-text" id="site_about">{homepage[0].description}</p>
                </div>
            </div>
 

            {/*home page */}
            <div className="modal fade" id="home-page" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form id="general_s_form">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">HOME PAGE SETTINGS</h2>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                <label className='form-label' class="form-label">Heading</label>
                                 <input type="text" className="form-control" value={home.heading} onChange={(e) => setHome({ ...home, heading: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                <label className='form-label' htmlFor="exampleFormControlTextarea1" class="form-label">Paragraph in Home</label>
                                <textarea className="form-control admin_form" value={home.paragraph} onChange={(e) => setHome({ ...home, paragraph: e.target.value })} rows="3"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn text-secondary shadow-none" data-bs-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-dark text-white shadow-none"  data-bs-dismiss="modal"  onClick={handleHomeSubmit}>SUBMIT</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

{/*feature*/}

<div className="card border-0 shadow m-4">
                <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="card-title m-0">FEATURE</h2>
                        <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#feature-page" >Add</button>
                    </div>

{features.length==0  && (<p>Need to add books</p>)}

{features.length > 0 && (
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
    {features.map((item, index) => (
      <tr key={index}>
        <td><img src={item.img.startsWith('https') ?item.img : `upload/${item.img}`}/></td>
        <td>{item.heading}</td>
        <td>{item.actual_price}</td>
        <td>{item.present_price}</td>
        <td>{item.quantity}</td>
        <td><button className='delete' onClick={() => handleDeletecategory(item.book_id)}>Delete</button></td>
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
                                <h2 className="modal-title">ADD BOOKS TO FEATURES</h2>
                            </div>
                            <div className="modal-body">

                            <div class="mb-3">
  <label className='admin_label' class="form-label">Heading</label>
  <input type="text" class="form-control" id="exampleFormControlInput1"  value={featureHeading} onChange={(e) => setFeatureHeading(e.target.value)} />
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
  <textarea class="form-control admin_form" id="exampleFormControlTextarea1" rows="3" value={featureDescription} onChange={(e) => setFeatureDescription(e.target.value)}></textarea>
</div>
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn text-secondary shadow-none" data-bs-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-dark text-white shadow-none"  data-bs-dismiss="modal"  onClick={handleFeatureSubmit}>SUBMIT</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


{/*arrivals*/}




<div className="card border-0 shadow m-4">
                <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="card-title m-0">ARRIVALS</h2>
                        <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#arrival-page" >Add</button>
                    </div>

{arrivals.length==0  && (<p>Need to add books</p>)}

{arrivals.length > 0 && (
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
    {arrivals.map((item, index) => (
      <tr key={index}>
        <td><img src={item.img.startsWith('https') ?item.img : `upload/${item.img}`}/></td>
        <td>{item.heading}</td>
        <td>{item.actual_price}</td>
        <td>{item.present_price}</td>
        <td>{item.quantity}</td>
        <td><button className='delete' onClick={() => handleDeletecategory(item.book_id)}>Delete</button></td>
      </tr>
    ))}
  </tbody>
</table>
)}
</div>
</div>


<div className="modal fade" id="arrival-page" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <form id="general_s_form">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">ADD BOOKS TO ARRIVALS</h2>
                            </div>
                            <div className="modal-body">
                            <div class="mb-3">
  <label className='admin_label' class="form-label">Heading</label>
  <input type="text" class="form-control" id="exampleFormControlInput1"  value={arrivalHeading} onChange={(e) => setArrivalHeading(e.target.value)} />
</div>

<div class="mb-3">
  <label className='admin_label' class="form-label">Actual Price</label>
  <input type="number" class="form-control" value={arrivalActualPrice} onChange={(e) =>setArrivalActualPrice(e.target.value)} id="exampleFormControlInput1"/>
</div>
<div class="mb-3">
  <label className='admin_label' class="form-label">Present Price</label>
  <input type="number" class="form-control"  value={arrivalPresentPrice} onChange={(e) => setArrivalPresentPrice(e.target.value)} id="exampleFormControlInput1"/>
</div>
<div class="mb-3">
  <label className='admin_label' class="form-label">Quantity</label>
  <input type="number" class="form-control"  value={arrivalQuantity} onChange={(e) => setArrivalQuantity(e.target.value)} id="exampleFormControlInput1"/>
</div>
<div className="mb-3">
  <label className='admin_label' class="form-label">Genre</label>
  <select className="form-control" value={arrivalgenre} onChange={(e) => setarrivalsgenre(e.target.value)}>
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
  <input class="form-control" type="file" id="formFile" onChange={e=>setfile2(e.target.files[0])}/>
</div>

                         
<div class="mb-3">
  <label className='admin_label' for="exampleFormControlTextarea1" class="form-label">Descriptions</label>
  <textarea class="form-control admin_form" id="exampleFormControlTextarea1" rows="3" value={arrivalDescription} onChange={(e) => setArrivalDescription(e.target.value)}></textarea>
</div>
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn text-secondary shadow-none" data-bs-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-dark text-white shadow-none"  data-bs-dismiss="modal"  onClick={handleArrivalSubmit}>SUBMIT</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>






</div>
</div>
</>
   
  )
}


export default Forms