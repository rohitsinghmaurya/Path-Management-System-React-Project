import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import './contact.css';

const Contact = () => {
  const [locations, setLocations] = useState([]); 
  const [markers, setMarkers] = useState([]); 
  const mapRef = useRef(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!mapRef.current) {
     const  leafletMap = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap);

      mapRef.current = leafletMap;
    }

    getCurrentLocation();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        mapRef.current.setView([currentLocation.lat, currentLocation.lng], 12);
        const address = await getAddressAndStore(currentLocation.lat, currentLocation.lng);

        let currentLocationInput = document.querySelector('.input1');
        if(currentLocationInput){
          currentLocationInput.value = address;
        }

        currentLocation.name = address;
        setLocations([currentLocation, ...locations]);
      }, (error) => {
        console.error('Error getting current position:', error);
        alert('Error getting current position');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };


  function fetchTouristAttraction(lat , lon){
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="attraction"](around:5000,${lat},${lon});out body;`;

     fetch(overpassUrl)
     .then(response =>{
         if(!response.ok){
            throw new Error("Failed to Fetch Tourist Attraction.");
         }
         return response.json();
     })
     .then(data =>{
      
         if(data.elements && data.elements.length > 0){
              DisplayTouristAttraction(data.elements);
         }  
         else{
            DisplayNotAttractionMessage();
         }
     })
     .catch(error =>{
        console.log("Error fetching Tourist Attraction" , error);
     });
  }


  function DisplayNotAttractionMessage(){
       const attractionList = document.getElementById('attractions');
       attractionList.innerHTML = '<li>No Tourist Attraction Found Near this Location</li>'
  }


  function DisplayTouristAttraction(attractions){
         const attractionList = document.getElementById('attractions');
         attractionList.innerHTML = '';
         attractions.forEach(attraction =>{
             const listItem = document.createElement('li');
             listItem.textContent = attraction.tags?.name || 'Unnamed Attraction';
             
             listItem.classList.add('attraction-item');
             listItem.style.fontSize = 'small';
             attractionList.appendChild(listItem);
         })
  }


  const getAddressAndStore = async (lat , lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unknown Location';
    }
  };

  const addLocation = () => {
    const taskInput = document.querySelector('.input2');
    const task = taskInput.value.trim();

    if (task !== '') {
      document.querySelector('.taskbox').classList.add('move-left');
      document.querySelector('.emptybox').classList.add('move-right');
      const taskList = document.querySelector('.taskbox');
      const newTask = document.createElement('li');
      newTask.textContent = task;
      taskList.appendChild(newTask);
      taskInput.value = '';
      geocodeAddress(task);
    } else {
      alert('Please enter a valid location.');
    }
  };

  const geocodeAddress = (address) => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const location = {
            name: address,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
          mapRef.current.setView([location.lat, location.lng], 12);
          placeMarker(location);
          fetchTouristAttraction(location.lat , location.lng);
          setLocations([...locations, location]);
        } else {
          alert('Location not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('Error fetching data');
      });
  };

  const placeMarker = (location) => {
    const marker = L.marker([location.lat, location.lng]).addTo(mapRef.current);
    setMarkers([...markers, marker]);
  };

  const deleteTask = () => {
    const taskList = document.querySelector('.taskbox');
    const lastTaskIndex = taskList.children.length - 1;
    if (lastTaskIndex >= 0) {
      taskList.removeChild(taskList.children[lastTaskIndex]);
    }

    if (taskList.children.length === 0) {
      document.querySelector('.taskbox').classList.remove('move-left');
      document.querySelector('.emptybox').classList.remove('move-right');
    }

    if (markers.length > 0) {
      mapRef.current.removeLayer(markers.pop());
      locations.pop();
    }
  };

  const calculateAndDisplayShortestPath = () => {
    if (locations.length < 2) {
      alert('Please add at least two locations.');
      return;
    }

    const sortedLocations = sortLocationsByProximity(locations);

    
    navigate('/result', { state: { path: sortedLocations } });
  };

  const sortLocationsByProximity = (locations) => {
    const sortedLocations = [locations[0]]; 

    let remainingLocations = [...locations].slice(1);

  
    let currentLocation = locations[0];
    while (remainingLocations.length > 0) {
      let nearestLocation = remainingLocations.reduce((nearest, location) => {
        const distanceToNearest = getDistance(currentLocation, nearest);
        const distanceToCurrent = getDistance(currentLocation, location);
        return distanceToCurrent < distanceToNearest ? location : nearest;
      });
      sortedLocations.push(nearestLocation);
      currentLocation = nearestLocation;
      remainingLocations = remainingLocations.filter(location => location !== nearestLocation);
    }

    return sortedLocations;
  };

  const getDistance = (loc1, loc2) => {
    const lat1 = loc1.lat, lng1 = loc1.lng;
    const lat2 = loc2.lat, lng2 = loc2.lng;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };



  return (
    <div>
      <div className="firstbox">
        <h1>
          Discover Your Path,
          <br />
          A Journey of Self-Exploration.
        </h1>
        <div className="location-container">
          <input
            type="text"
            placeholder="Enter Your Current Location."
            className="input1"
          />
          <button onClick={addLocation} type="submit" id="findlocation">
            Add Location
          </button>
          <button onClick={deleteTask} type="submit" className="mt-[20px]" id="delete">
            Delete
          </button>
          <input
            type="text"
            placeholder="Enter Your Destination Location"
            className="input2"
          />
         

          <button
            id="calculatepath"
            onClick={calculateAndDisplayShortestPath}
            className="mt-[20px]"
          >
            Find Path
          </button>

          <ul id = 'attractions' className="attractions"></ul>

          <div className="container">
            <div className="taskbox"></div>
            <div className="emptybox">
              <div id="map"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
