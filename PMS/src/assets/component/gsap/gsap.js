import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MyComponent = () => {
  useEffect(() => {
    // Example GSAP animation with ScrollTrigger
    gsap.fromTo(
      '.box',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.box',
          start: 'top 80%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div>
      <div className="box" style={{ height: '100px', backgroundColor: 'lightblue' }}>
        Scroll-triggered animation
      </div>
    </div>
  );
};

export default MyComponent;
