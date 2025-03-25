// src/pages/UserForm.jsx
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const UserForm = () => {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleSubmit = async () => {
    if (!name || !walletAddress) {
      alert("Please fill in both fields.");
      return;
    }

    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, walletAddress }),
    });

    if (response.ok) {
      alert("User added successfully!");
      setName("");
      setWalletAddress("");
    } else {
      alert("Failed to add user.");
    }
  };

  return (
    <div className="py-3">
      <h3 className="text-center mb-3">Add a User</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Wallet Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </Form.Group>

        <Button variant="success" className="w-100" onClick={handleSubmit}>
          Add User
        </Button>
      </Form>
    </div>
  );
};

export default UserForm;
