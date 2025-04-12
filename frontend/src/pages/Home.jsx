import React, { useEffect, useState } from 'react';

import '../App.css';

const PopupComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  localStorage.clear()

  useEffect(() => {
    console.log('PopupComponent mounted');
    const hasPopupBeenShown = localStorage.getItem('popupShown');

    if (!hasPopupBeenShown) {
      localStorage.setItem('popupShown', 'true');
      setShowPopup(true);
    }
  }, []);

  const handlePopupClose = () => {
    console.log('Popup closed');
    setShowPopup(false);
    localStorage.removeItem('popupShown');
  };

  useEffect(() => {
    const closePopupOnClick = (event) => {
      handlePopupClose();
    };
    document.addEventListener('click', closePopupOnClick);
    return () => {
      document.removeEventListener('click', closePopupOnClick);
    };
  }, [showPopup]);

  return (
    <>
      {showPopup && (

        <div className="welcome" onClick={handlePopupClose}>
          <button className="close-button" onClick={handlePopupClose} style={{ fontSize: 23 }}>
            X
          </button>
          <p><strong>Greetings newcomer and welcome,</strong></p>
          <p>We're thrilled to have you on board. To ensure you make the most out of your experience, we'd like to guide you through the options available to you:</p>
          <p><strong>Option 1:</strong> Recognising Trends with Semantic Search<br />
            To tailor your experience and provide you with relevant information, please take a moment to build your query. This will grant you access to a variety of
            data related to the current state of specific sectors and verticals, ans also to valuations and startups introductions signaling reovery in investments and more. Feel free to explore and interact with the charts to delve into the details of each vizualisation.</p>
          <p><strong>Option 2:</strong> Benchmarking Dashboard<br />
            To gain comprehensive insights on the performance of your portfolio of startups to identify how well they compare to others.</p>
          <p>Thank you for using our application. We hope you enjoy your journey with us!</p>
        </div>
      )}
    </>
  );
};

const Home = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='home-container'>
      <div className="context-container">
        <h3> Context of the study </h3>
        <p>Startupticker possesses one of the most comprehensive and reliable datasets on Swiss startups,
          currently utilized solely for internal reporting. However, this valuable data remains largely
          untapped by the broader ecosystem. Unlocking this data for startups, investors, and support
          organizations could significantly enhance transparency and strategic decision-making. With
          advanced tools like semantic search and ontology-based classification, we see a unique
          opportunity to extract actionable insights. Key use cases include: (1) Recognising
          trends—identifying sectoral developments, funding recoveries, or investment waves through
          semantic analysis; and (2) Benchmarking—enabling users to compare their startups’ performance
          against national averages via an intuitive, public dashboard. Our approach focuses on building
          a model to structure descriptors and develop intelligent algorithms for insight generation. The
          result will be a prototype that emphasizes functionality and user impact over presentation polish,
          supported by a live demo and clear development roadmap.</p>
      </div>
      <div className='main-map-container'>
      </div>
      <PopupComponent />
    </div>
  );
};

export default Home;