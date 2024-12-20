import './Navigation.css';
import { Link } from 'react-router-dom';
import React , {useState , useEffect, useRef} from 'react';
import MainPage from '../../MainPage/MainPage.jsx';


const Navigation = () => {

 const images = [
     'images/Delhi_Gate.jpg',
     'images/DelhiFort.jpg',
     'images/Mumbai_Gate.jpg',
     'images/QutubMinar.jpg',
     'images/south-temple.jpg',
     'images/TajHotel.jpg',
     'images/TajMahal.jpg',
     'images/Travel.jpg',
     'images/varanasiGhat.jpg',
 ];

 const [currentImageIndex , setCurrenImageIndex] = useState(0);

 useEffect(()=>{
   const interval = setInterval(() =>{
         setCurrenImageIndex((prevIndex) => (prevIndex + 1)%images.length);
   } , 3000);

   return () => clearInterval(interval);

 },[images.length])

 
  return (
  <div className="navigation_fullscreen"
     style={{backgroundImage: `url(${images[currentImageIndex]})`}}
  >
    <nav  className="navi">
      <img src="/images/map.png" alt="Map Logo" />
      <ul>
        <div>
          <h4>
            <Link to="/login">Login</Link>
          </h4>
        </div>
        <div>
          <h4>
            <Link to="/contact">Contact</Link>
          </h4>
        </div>
        <div>
          <h4>
            <Link to="/way">Way</Link>
          </h4>
        </div>
        <div>
          <h4>
            <Link to="/adventure">Adventure</Link>
          </h4>
        </div>
      </ul>
    </nav>
    <div className="scroll_indicator">Scroll Down</div>
  </div>
  );
};

export default Navigation;
