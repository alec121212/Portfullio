import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate("/dashboard")
    }
    return(
        <div>
            <h1>Login</h1>
            <GoogleLogin onSuccess={handleSuccess}/>
        </div>
    );
}

export default Login;