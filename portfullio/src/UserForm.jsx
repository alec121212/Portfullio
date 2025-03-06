import { useState } from "react";

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
            headers: {
                "Content-Type": "application/json",
            },
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
        <div className="form-container">
            <h2 className="form-heading">Add User</h2>
            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
            />
            <input
                type="text"
                placeholder="Enter Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="form-input"
            />
            <button onClick={handleSubmit} className="form-button">
                Add User
            </button>
        </div>
    );
};

export default UserForm;
