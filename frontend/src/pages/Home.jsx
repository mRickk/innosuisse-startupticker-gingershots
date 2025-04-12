import React, { useEffect, useState } from 'react';

import '../App.css';

const PopupComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  localStorage.clear()

  useEffect(() => {
    const hasPopupBeenShown = localStorage.getItem('popupShown');

    if (!hasPopupBeenShown) {
      localStorage.setItem('popupShown', 'true');
      setShowPopup(true);
    }
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
    localStorage.removeItem('popupShown');
  };

  useEffect(() => {
    const closePopupOnClick = () => {
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
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 text-justify"
          onClick={handlePopupClose}
        >
          <div
            className="relative bg-white p-6 border-2 border-gray-200 w-[70%] max-w-[700px] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-gray-600 hover:text-red-600"
              onClick={handlePopupClose}
              style={{ fontSize: 16 }}
            >
              X
            </button>
            <p>
              <strong>Greetings newcomer and welcome,</strong>
            </p>
            <br></br>
            <p>
              We're thrilled to have you on board. To ensure you make the most out of your experience, we'd like to guide you through the options available to you:
            </p>
            <br></br>
            <p>
              <strong>Page Search:</strong> Recognising Trends with Semantic Search
              <br />
              To tailor your experience and provide you with relevant information, please take a moment to build your query. This will grant you access to a variety of data related to the current state of specific sectors and verticals, as well as valuations and startup introductions signaling recovery in investments and more. Feel free to explore and interact with the charts to delve into the details of each visualization.
            </p>
            <br></br>
            <p>
              <strong>Page Benchmark:</strong> Benchmarking Dashboard
              <br />
              To gain comprehensive insights on the performance of your portfolio of startups and identify how well they compare to others.
            </p>
            <br></br>
            <p>Thank you for using our application. We hope you enjoy your journey with us!</p>
          </div>
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
      </div>
      <div className='main-map-container'>
      </div>
      <PopupComponent />
    </div>
  );
};

export default Home;