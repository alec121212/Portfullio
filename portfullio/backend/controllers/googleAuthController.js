import { OAuth2Client }from 'google-auth-library';
import user from '../models/user.js';
import dotenv from 'dotenv';
import { jwtDecode } from 'jwt-decode';
dotenv.config();

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        const decoded = jwtDecode(token);

        const { email, name, picture } = decoded;
        console.log(decoded);

        if (!email) {
            return res.status(400).json({ error: 'Missing email in token' });
        }      
        let User = await user.findOne({ email });
        if (!User) {
            User = await user.create({
                email,
                name,
                picture 
            });
        }

        res.json({ success: true, User });
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
};

