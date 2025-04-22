import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Col } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('user');

    if (jwtToken && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setUser(null);
  };

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
                {user ? (
                  <>
                    <span className="me-3">Welcome, {user.name}!</span>
                    <Button variant="outline-danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    className="me-2 px-4"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                )}
              </div>

              <hr />

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
