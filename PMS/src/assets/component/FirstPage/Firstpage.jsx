import React, { useState, useEffect } from 'react';
import MainPage from '../../../MainPage/MainPage';
import './Firstpage.css';

const Firstpage = () => {
  const [showMainPage, setShowMainPage] = useState(false);

  useEffect(() => {
    
    const h1Element = document.querySelector('#first_page h1');
    if (h1Element) {
      setTimeout(() => {
        h1Element.classList.add('loaded');
      }, 2000);
    }

    const timeout1 = setTimeout(() => {
      const firstPageElement = document.getElementById('first_page');
      if (firstPageElement) {
      
        firstPageElement.classList.add('fade-out');
      }

      const timeout2 = setTimeout(() => {
        setShowMainPage(true);
      }, 500); 

      return () => clearTimeout(timeout2);
    }, 1000); 

    return () => clearTimeout(timeout1);
  }, []);

  return (
    <div>
      {!showMainPage && (
        <div id="first_page" className="first-page-container">
          <h1 className="welcome-text">
            WELCOME TO <br /> PATH MANAGEMENT SYSTEM
          </h1>
        </div>
      )}

      {showMainPage && <MainPage />}
    </div>
  );
};

export default Firstpage;
