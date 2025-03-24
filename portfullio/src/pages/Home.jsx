// Home Screen
import React from 'react';
import UserForm from "../UserForm";
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const nav = useNavigate()

  return (
    <>
    <div className="topOfPage">
        <h1>Welcome to the Portfullio Home Page!</h1>
        <h2>University of Florida Senior Project Spring 2025</h2>
        <h3>By: Mike Damiano, Patrick Quinlan, Alec Rakita, Oliver Peralta</h3>
        <UserForm />
        <button onClick={() => nav("/Crypto")}>View Crypto</button>
    </div>
    </>
  );
};

export default Home;
