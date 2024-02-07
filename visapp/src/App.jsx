import { useState } from 'react'
import reactLogo from './assets/react.svg' // Ensure these logos are used or remove these imports
import viteLogo from '/vite.svg'
import './App.css'
import MenuBar from './MenuBar';
import About from './About';
import HowToUse from './HowToUse';
import Vis from './Vis';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <MenuBar />
      <div className='mainWindow'>
        <Routes>
          <Route path="/" element={<Vis />} />
          <Route path="/about" element={<About />} />
          <Route path="/howtouse" element={<HowToUse />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
