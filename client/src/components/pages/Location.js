import React, { useState, useRef, useEffect, useCallback ,useContext} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

import { AuthContext } from "../../context/authcontext";
import {loadStripe} from '@stripe/stripe-js';
let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

const Location = () => {
  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
  const {currentuser}=useContext(AuthContext);
  const location=useLocation();
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const autoCompleteRef = useRef(null);
  const [cart,setcart]=useState();
  const navigate = useNavigate();

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
      // types: ["(cities)"],
      componentRestrictions: { country: 'IN' },
    });

    autoComplete.addListener('place_changed', () => {
      handlePlaceSelect(updateQuery);
    });
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = await autoComplete.getPlace();

    const query = addressObject.formatted_address;
    updateQuery(query);
    console.log({ query });

    const latLng = {
      lat: addressObject?.geometry?.location?.lat(),
      lng: addressObject?.geometry?.location?.lng(),
    };

    console.log({ latLng });
    setSelectedLocation(latLng);
  };

  useEffect(() => {
    if(location){
    setcart(location.state.cart);
    }
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLatLng = { lat: latitude, lng: longitude };
        setCurrentLocation(currentLatLng);
        setSelectedLocation(currentLatLng);
      },
      (error) => console.error('Error getting current location:', error)
    );
  }, []);

  const handleConfirm = async () => {
    
    const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
    console.log(stripePublicKey)
    const stripe = await loadStripe(stripePublicKey);

    const response = await fetch(`${process.env.REACT_APP_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: cart,
        address: query,
        location: selectedLocation,
        userid:currentuser.iduser
      })
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <div className='map'>
      <label className='heading'>Type your Location</label>
      <input
        ref={autoCompleteRef}
        className='form-control'
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder='Search Places ...'
      />
     
      {selectedLocation && <MapComponent selectedLocation={selectedLocation} />}
      <button className='btn' onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

const MapComponent = ({ selectedLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return 'Error';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div style={{ marginTop: '50px' }}>
      <GoogleMap
        mapContainerStyle={{
          height: '500px',
        }}
        center={selectedLocation}
        zoom={13}
        onLoad={onMapLoad}
      >
        <MarkerF
          position={selectedLocation}
          icon={'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
        />
      </GoogleMap>
    </div>
  );
};

export default Location;
