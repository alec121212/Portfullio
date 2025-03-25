// Home Screen
import React from 'react';
import { useNavigate } from "react-router-dom";
import UserForm from "../UserForm";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="topOfPage">
        <h1>Welcome to the Portfullio Home Page!</h1>
        <h2>University of Florida Senior Project Spring 2025</h2>
        <h3>By: Mike Damiano, Patrick Quinlan, Alec Rakita, Oliver Peralta</h3>
        <button onClick={() => navigate("/Login")}>Login</button>
        <UserForm />
        <button onClick={() => navigate("/Crypto")}>View Crypto</button>
        <button onClick={() => navigate("/investments")}>View Investments</button>
    </div>
    </>
  );
};

export default Home;
