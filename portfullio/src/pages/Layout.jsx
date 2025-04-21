// src/pages/Layout.jsx
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import "./Layout.css"; // optional extra styling

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // Light/Dark theme state
  const [darkMode, setDarkMode] = useState(() => {
    // Load saved theme from localStorage if it exists
    const saved = localStorage.getItem("portfullioTheme");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Toggle a CSS class on <body> for dark mode
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Save to localStorage
    localStorage.setItem("portfullioTheme", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  return (
    <>
      <Navbar expand="lg" className="py-3 shadow-sm" bg="light" variant="light">
        <Container fluid>
          {/* Left side: Back/Forward Buttons */}
          <div className="d-flex align-items-center me-3">
            <Button variant="outline-secondary" className="me-2" onClick={handleBack}>
              ←
            </Button>
            <Button variant="outline-secondary" onClick={handleForward}>
              →
            </Button>
          </div>

          {/* Center: Brand */}
          <Navbar.Brand as={Link} to="/" className="mx-auto fw-bold fs-4 text-primary">
            Portfullio
          </Navbar.Brand>

          {/* Right side: Nav + Dark Mode Toggle */}
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/portfolio">
                Portfolio
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              {/* Toggle Switch for Dark Mode */}
              <Form.Check 
                type="switch"
                id="themeSwitch"
                className="ms-3 align-self-center"
                label={darkMode ? <BsMoonFill /> : <BsSunFill />}
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="layout-content p-4">{children}</div>
    </>
  );
};

export default Layout;
