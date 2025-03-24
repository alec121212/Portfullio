import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';
import Crypto from './pages/Crypto'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/crypto" element={<Crypto/>} />
      </Routes>
    </Router>
  )
}

export default App;
