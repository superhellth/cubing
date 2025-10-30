import { useState } from 'react';
import './App.css'
import TimerScreen from './modules/timer/TimerScreen';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AlgorithmScreen from './modules/algorithms/AlgorithmScreen';

function App() {

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/algs">Algs</Link> |{" "}
        {/* <Link to="/contact">Contact</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<TimerScreen />} />
        <Route path="/algs" element={<AlgorithmScreen />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
