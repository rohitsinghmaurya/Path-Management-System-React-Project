import React from 'react'
import Navigation from '../assets/Navigation/Navigation'
import Page1 from '../assets/component/page1/page1'
import Page2 from '../assets/component/page2/page2'
import Scroller from '../assets/component/scroller-in/scroller'

const MainPage = () => {
  return (
    <div className='main'>
       <Navigation/>
       <Page1/>
       <Page2/>
       <Scroller/>
    </div>
  );
};

export default MainPage;