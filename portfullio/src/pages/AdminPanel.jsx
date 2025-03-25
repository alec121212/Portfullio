// src/pages/AdminPanel.jsx
import React from "react";
import { Container, Alert } from "react-bootstrap";

const AdminPanel = () => {
  return (
    <Container>
      <Alert variant="danger" className="mt-4">
        <h4>Admin Panel</h4>
        <p>Only Admins can view this page!</p>
      </Alert>
      <p>Manage user accounts, perform system-wide tasks, etc.</p>
    </Container>
  );
};

export default AdminPanel;
