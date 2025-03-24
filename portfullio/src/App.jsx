import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Crypto from './pages/Crypto'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/crypto" element={<Crypto/>} />
      </Routes>
    </Router>
  )
}

export default App;
