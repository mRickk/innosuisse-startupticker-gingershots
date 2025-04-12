import React, { useState } from 'react';

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
        <Router>
        <Navbar />
        <main className="grid grid-cols-[auto_80%_auto] py-36 justify-center">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchEngine />} />
            <Route path="/benchmark" element={<Benchmark />} />
          </Routes>
          </main>
        </Router>
    </div>
  );
}
export default App;