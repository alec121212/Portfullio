import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate("/dashboard")
    };

    const handleFailure = () => {
        console.log("Login Failed");
    };

    return(
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body">
                    <h1 className="card-title text-center mb-4">Login to Portfullio</h1>
                    <p className="text-center mb-4">Track your investments all in one place.</p>   
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleFailure}
                    />
                </div>
            </div>
        </div>
  );
};

export default Login;