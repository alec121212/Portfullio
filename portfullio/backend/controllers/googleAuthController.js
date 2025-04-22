import jwt from 'jsonwebtoken';
import user from '../models/user.js';
import dotenv from 'dotenv';
import { jwtDecode } from 'jwt-decode';
dotenv.config();

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        const { sub: googleId, email, name, picture } = jwtDecode(token);

        if (!email) {
            return res.status(400).json({ error: 'Missing email in token' });
        }

        let User = await user.findOne({ $or: [{ googleId }, { email }] });

        if (!User) {
            User = await user.create({
                googleId,
                email,
                name,
                profilePicture: picture
            });
        }

        // JWT Generation
        const payload = { id: User._id, email: User.email };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, user: User, token: jwtToken });

    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
};
