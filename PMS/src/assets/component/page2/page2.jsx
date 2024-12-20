import {img1} from '../../../utils/image1.js'
import './page2.css'

const page2 = () => {
  return (
    <div>
    <div className="scroller">
        <div className="scroller-in">
            <h4>LOGIN</h4>
            <h4>CONTACT</h4>
            <h4>WORLD MAP</h4>
            <h4>ADVENTURE</h4>
        </div>
    </div>

    <div className="about-us">
         <img src={img1} alt="" />
          <div className="about-us-in">
                <h3>ABOUT-US</h3>
              <p>
               Our path management system is designed to efficiently 
               find the shortest routes between multiple locations, 
               ensuring you reach your destination in the minimum time possible. 
               With a user-friendly interface and interactive maps, 
               you can easily input your locations and visualize your route. 
               Real-time updates keep you informed of traffic conditions,
               while customizable options allow you to tailor your route preferences. 
               Whether you are on the go or planning ahead, our system provides reliable 
               and accurate route calculations 
               to streamline your journey.
              </p>
          </div>
          <img src = {img1} alt="" />
    </div>
</div>
  );
};

export default page2