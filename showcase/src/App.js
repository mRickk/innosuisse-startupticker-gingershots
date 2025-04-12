import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

import Navbar from './components/Navbar';


function App() {
  return (
    <div className="app-container">
      <main className="page-content">
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
        </Routes>
      </Router>
      </main>
    </div>
  );
}
export default App;