import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { addNewUser, getAllUsers } from './utils/userUtils';
import { UserData } from './Models/User';

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.get('/users', (req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', (req: Request, res: Response) => {
  const { name, walletAddress }: UserData = req.body;

  if (!name || !walletAddress) {
    res.status(400).json({ error: 'Name and wallet address are required' });
    return;
  }

  const newUser: UserData = { name, walletAddress };

  try {
    addNewUser(newUser);
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
