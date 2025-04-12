import React from 'react';

import './App.css';

import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import { useEffect } from 'react';
import SearchEngine from './pages/SearchEngine';
import Benchmark from './pages/Benchmark';


function App() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div className="app-container">
      <main className="page-content">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/home" exact element={<Home />} />
            <Route path="/search" exact element={<SearchEngine />} />
            <Route path="/benchmark" exact element={<Benchmark />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}
export default App;