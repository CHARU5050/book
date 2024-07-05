import React, { useState,useEffect } from 'react';
import "./adminform.css"
import axios from 'axios';
import Adminpage from './Adminpage';

const AdminForm = () => {
    const [general_settings, setgeneral_settings] = useState({ heading: 'fffffff', paragraph: '' });
    const [formgeneral_settings, setformgeneral_settings] = useState({ heading: '', paragraph: '' });
    const [shutdown,setshutdown]=useState('');
    const [contactData, setContactData] = useState({
        address: '',
        gmap: '',
        pn1: '',
        pn2: '',
        email: '',
        fb: '',
        insta: '',
        tw: '',
        iframe: ''
    });
    const [formcontactData, formsetContactData] = useState({
        address: '',
        gmap: '',
        pn1: '',
        pn2: '',
        email: '',
        fb: '',
        insta: '',
        tw: '',
        iframe: ''
    });
    useEffect(()=>{
        getgeneral_settings();
        getcontact_details();
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;

        formsetContactData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }





    const handleEdit = () => {
        setformgeneral_settings({ heading: general_settings.heading, paragraph: general_settings.paragraph });
    }


    const handlecontactEdit=()=>{
        formsetContactData({address:contactData.address,gmap:contactData.gmap, 
            pn1: contactData.pn1,
            pn2: contactData.pn2,
            email: contactData.email,
            fb: contactData.fb,
            insta: contactData.insta,
            tw: contactData.tw,
            iframe: contactData.iframe})
                }

    const handlecontactformsubmit= async (e)=>{
        e.preventDefault(); 
        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/updatecontactdetails`,formcontactData);
            setContactData({address:formcontactData.address,gmap:formcontactData.gmap, 
                pn1: formcontactData.pn1,
                pn2: formcontactData.pn2,
                email: formcontactData.email,
                fb: formcontactData.fb,
                insta: formcontactData.insta,
                tw: formcontactData.tw,
                iframe: formcontactData.iframe})
            
          } catch (error) {
            console.error(error);
          }
        
    }

    const getgeneral_settings = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/generalsettings`);
      
          setgeneral_settings({ heading: response.data[0].site_title, paragraph:response.data[0].site_about });
          setshutdown(response.data[0].shutdown);
        } catch (error) {
          console.error(error);
        }
      };
      const getcontact_details = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/contactdetails`);
          setContactData({address:response.data[0].address,gmap:response.data[0].gmap, 
            pn1: response.data[0].pn1,
            pn2: response.data[0].pn2,
            email: response.data[0].email,
            fb: response.data[0].fb,
            insta: response.data[0].insta,
            tw: response.data[0].tw,
            iframe: response.data[0].iframe})
    
          setshutdown(response.data[0].shutdown);
        } catch (error) {
          console.error(error);
        }
      };


      const handleFormSubmit = async () => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_URL}/updategeneralsettings`,formgeneral_settings);
          setgeneral_settings({ heading: formgeneral_settings.heading, paragraph: formgeneral_settings.paragraph });
          
        } catch (error) {
          console.error(error);
        }
      };

      const upshutdown= async(e)=>{
        console.log(e.target.checked);
        try{
        const res= await axios.post(`${process.env.REACT_APP_URL}/shutdown`,{shutdown:e.target.checked});
        getgeneral_settings();
        }
        catch(error){
            console.log(error);

        }
      }

    
    



    return (
      <>
      <Adminpage></Adminpage>
   
      <div className='col-lg-10 ms-auto'>
      
        <div className='setting-sections'>
            <h1 className='m-4'>SETTINGS</h1>
            <div className="card border-0 shadow m-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="card-title m-0">General Settings</h2>
                        <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#general-s" onClick={handleEdit}>Edit</button>
                    </div>
                    <h3 className="card-subtitle mb-1 fw-bold">Site Title</h3>
                    <p className="card-text" id="site_title">{general_settings.heading}</p>
                    <h3 className="card-subtitle mb-1 fw-bold">About us</h3>
                    <p className="card-text" id="site_about">{general_settings.paragraph}</p>
                </div>
            </div>

            {/* General Settings popup */}
            <div className="modal fade" id="general-s" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form id="general_s_form">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">General Settings</h2>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Site Title</label>
                                    <input type="text" name="site_title" id="site_title_inp" value={formgeneral_settings.heading} onChange={(e) => setformgeneral_settings({ ...formgeneral_settings, heading: e.target.value })} className="form-control shadow-none" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">About us</label>
                                    <textarea className="form-control shadow-none" id="site_about_inp" value={formgeneral_settings.paragraph} onChange={(e) => setformgeneral_settings({ ...formgeneral_settings, paragraph: e.target.value })} name="site_about" rows="6" required></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn text-secondary shadow-none" data-bs-dismiss="modal">CANCEL</button>
                                <button type="button" className="btn btn-dark text-white shadow-none"  data-bs-dismiss="modal"  onClick={handleFormSubmit}>SUBMIT</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* shutdown */}
            <div class="card border-0 shadow m-4">
  <div class="card-body">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="card-title m-0">Shutdown Website</h2>
      <div class="form-check form-switch">
        <input class="form-check-input" onChange={upshutdown}  type="checkbox" role="switch" id="shutdown-toggle" checked={shutdown} />
      </div>
    </div>

    <p class="card-text" id="site_title">No customer will be allowed to book a hotel room when shutdown mode is turned on.</p>
  </div>
</div>



{/*contact*/}

<div class="card border-0 shadow m-4">
  <div class="card-body">
    <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="card-title m-0">Contact Settings</h2>
        <button type="button" class="btn btn-dark btn-sm shadow-none" data-bs-toggle="modal" data-bs-target="#contacts-s" onClick={handlecontactEdit}>
  Edit
  </button>
  
 
    </div>
    <div class="row">
    <div class="col-lg-6">
            <div class="mb-4">
        <h3 class="card-subtitle mb-1 fw-bold">Address</h3>
        <p class="card-text" id="address">{contactData.address}</p>
            </div>
            <div class="mb-4">
        <h3 class="card-subtitle mb-1 fw-bold">Google Map</h3>
        <p class="card-text" id="gmap">{contactData.gmap}</p>
            </div>
            <div class="mb-4">
        <h3 class="card-subtitle mb-1 fw-bold">Phone Numbers</h3>
        <p class="card-text" ><i class="bi bi-telephone-fill"></i><span id="pn1"></span>{contactData.pn1}</p>
            

        <p class="card-text" ><i class="bi bi-telephone-fill"></i><span id="pn2"></span>{contactData.pn2}</p>
            </div>
            <div class="mb-4">
        <h3 class="card-subtitle mb-1 fw-bold">E-mail</h3>
        <p class="card-text" id="email">{contactData.email}</p>
            </div>
            
    </div>


    <div class="col-lg-6">
    <div class="mb-4">
        <h3 class="card-subtitle mb-1 fw-bold">Social Links</h3>
        <p class="card-text mb-1" ><span id="fb"></span>{contactData.fb}</p>
        <p class="card-text mb-1" ><span id="insta"></span>{contactData.insta}</p>
        <p class="card-text mb-1" ><span id="tw"></span>{contactData.tw}</p>
    </div>
    <div class="mb-4">
        <h3 class="card-subtitle mb-1 fw-bold">iFrame</h3>
        <iframe class="border p-2 w-100" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0088333202248!2d80.0431775!3d12.971286399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f4d07355bab5:0xbb6063169c4ed4d9!2sChennai Institute of Technology!5e0!3m2!1sen!2sin!4v1689245491143!5m2!1sen!2sin"loading="lazy"></iframe>
    </div>



    </div>

    </div>
    </div>
  
  </div>


  
<div class="modal fade" id="contacts-s" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
      <form id="contacts_s_form">


    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Contacts Settings</h2>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                    <label class="form-label">Address</label>
                    <input
                            type="text"
                            name="address"
                            id="address_inp"
                            className="form-control shadow-none"
                            value={formcontactData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        
                    <label className="form-label">Google Map Link</label>
                    <input
                            type="text"
                            name="gmap"
                            id="gmap_inp"
                            className="form-control shadow-none"
                            value={formcontactData.gmap}
                            onChange={handleChange}
                            

                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                    <label className="form-label">Phone Number (with country code)</label>
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                        <input type="number" name="pn1" id="pn1_inp" className="form-control shadow-none" value={formcontactData.pn1}
                            onChange={handleChange} required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
            
                        <input type="number" name="pn2" value={formcontactData.pn2}
                            onChange={handleChange} className="form-control shadow-none" ></input>
                    </div>
                    </div>

                    <div className="mb-3">
                        
                    <label className="form-label">Email</label>
                    <input type="text" name="email" id="email_inp" className="form-control shadow-none" value={formcontactData.email}
                            onChange={handleChange} required />
                    </div>

              
                 </div>

                <div className="col-md-6">
                        <div className="mb-4">
                    <label className="form-label">Social Links</label>
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-facebook"></i></span>
                        <input type="text" name="fb" id="fb_inp" className="form-control shadow-none" value={formcontactData.fb}
                            onChange={handleChange} required />
                    </div>
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-instagram"></i></span>
                        <input type="text" name="insta" id="insta_inp" className="form-control shadow-none" value={formcontactData.insta}
                            onChange={handleChange} />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text"><i className="bi bi-twitter"></i></span>
                        <input type="text" name="tw" id="tw_inp" className="form-control shadow-none" value={formcontactData.tw}
                            onChange={handleChange}  ></input>
                    </div>
                    </div>
                    <div className="mb-3">
                        
                    <label className="form-label">iframe src</label>
                    <input type="text" name="iframe" id="iframe_inp" className="form-control shadow-none"  value={formcontactData.iframe}
                            onChange={handleChange}required />
                    </div>
                    
                </div>


            </div>
           
        </div>
    </div>
        
   
    
      <div className="modal-footer">
        <button type="button" className="btn text-secondary shadow-none" data-bs-dismiss="modal" >CANCEL</button>
        <button type="submit" className="btn btn-dark text-white shadow-none" onClick={handlecontactformsubmit} data-bs-dismiss="modal" >SUBMIT</button>
      </div>
    </div>
    </form>
  
</div>
</div>     
</div>
</div>
</>




    );
}

export default AdminForm;
