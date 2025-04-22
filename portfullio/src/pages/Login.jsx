import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Card, Button } from "react-bootstrap";
import { BsArrowLeftCircle } from "react-icons/bs";

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const credential = response.credential;

      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (data.success) {

        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard"); 
      } else {
        console.error("Auth error:", data.error || "Unknown error");
        alert("Google authentication failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    }
  };

  const handleFailure = () => {
    console.log("Google Login Failed");
    alert("Google Login Failed");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <Card className="shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="d-flex align-items-center mb-3">
          <Button variant="link" className="p-0 me-2" onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={24} />
          </Button>
          <h3 className="m-0">Sign In with Google</h3>
        </div>
        <p className="text-muted">Manage all your investments in one place.</p>

        <div className="d-flex justify-content-center my-4">
          <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
        </div>
      </Card>
    </div>
  );
};

export default Login;
