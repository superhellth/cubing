import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import AlgorithmScreen from './modules/algorithms/AlgorithmScreen';
import TimerScreen from './modules/timer/TimerScreen';

function App() {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <div style={{height: "100%", backgroundColor: "black"}}>
          <nav style={{height: "3%"}}>
            <Link to="/">Home</Link> |{" "}
            <Link to="/algs">Algs</Link> |{" "}
            {/* <Link to="/contact">Contact</Link> */}
          </nav>
          <div style={{height: "97%", backgroundColor: "blue"}}>
            <Routes>
              <Route path="/" element={<TimerScreen />} />
              <Route path="/algs" element={<AlgorithmScreen />} />
              {/* <Route path="/contact" element={<Contact />} /> */}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
