// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm.jsx"; 
import { Button, Card, Row, Col } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <Row className="justify-content-center my-5">
        <Col md={8} lg={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title as="h1" className="text-center mb-3">
                Welcome to <span style={{ color: "#3d64ff" }}>Portfullio</span>!
              </Card.Title>
              <Card.Text className="text-center text-muted">
                Manage your entire investment portfolio in one place.
              </Card.Text>

              <div className="d-flex justify-content-center my-4">
                <Button
                  variant="primary"
                  className="me-2 px-4"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="outline-primary"
                  className="px-4"
                  onClick={() => navigate("/crypto")}
                >
                  View Crypto
                </Button>
              </div>

              <hr />

              <UserForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
