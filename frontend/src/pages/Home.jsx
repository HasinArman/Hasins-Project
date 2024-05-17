import React, { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import './Home.css';
import header from '../Components/Assets/headers.jpg';

const Home = () => {
  useEffect(() => {
    const sr = ScrollReveal();
    
    const scrollRevealOptions = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    sr.reveal(".header__image img", {
      ...scrollRevealOptions,
      origin: "right",
      delay: 500,
    });

 
    sr.reveal(".header__content h2", {
      ...scrollRevealOptions,
      delay: 500,
    });

   
    sr.reveal(".header__content h1", {
      ...scrollRevealOptions,
      delay: 1000,
    });
  }, [1000]);

  return (
    <>
      <header className="header">
        <div className="section__container header__container" id="home">
          <div className="header__image">
            <img src={header} alt="header" />
          </div>
          <div className="header__content">
            <h2>Medical research illuminates the intricate tapestry of disease, revealing pathways to healing and hope</h2>
            <h1>Exploring<br /><span>Medical </span></h1>
          </div>
        </div>
      </header>
    </>
  );
}

export default Home;
