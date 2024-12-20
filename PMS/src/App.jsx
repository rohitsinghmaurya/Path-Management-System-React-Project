import './App.css';
import Navigation from './assets/Navigation/Navigation.jsx'
import Page1 from './assets/component/page1/page1.jsx'
import Page2 from './assets/component/page2/page2.jsx'
import Login from './Login/Login.jsx'
import Contact from './contact/contact.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Result from './Result/Result.jsx'
import Firstpage from './assets/component/FirstPage/firstpage.jsx';
import { useEffect, useState } from 'react';


function App(){
     const [showMainContent , setShowMainContent] = useState(false);
     useEffect(()=>{
        const timer =   setTimeout(()=>{
                setShowMainContent(true);
          } , 3000);    
          
          return ()=>clearTimeout(timer);

     },[]);

    

     return(
         <Router>
            <div>
                 <Routes>
                     <Route path='/' element=
                        {
                         <>
                         {/*Render the FirstPage first*/}
                         {!showMainContent && <Firstpage/>}
                         {/*Render the Main content when ready*/}
                         {showMainContent && <FirstPagewithContent/>}
                         </>
                         } 
                       />
                     <Route path='/login' element={<Login/>} />
                     <Route path='/contact' element = {<Contact/>} />
                     <Route path='/result' element = {<Result/>} />
                 </Routes>
            </div>
           
         </Router>
     );
};


function FirstPagewithContent(){
      return(
          
          <div className='mainPage'>
            <Navigation/>
          <div className="main">
               <Page1/>
               <Page2/>
          </div>
          <div className="images">
               <img src="./images/image1.png" alt="" />
               <img src="./images/image2.png" className='img2' alt="" />
          </div>
        </div>
      );
};

export default App;