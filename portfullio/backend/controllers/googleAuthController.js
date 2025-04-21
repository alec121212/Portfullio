import { OAuth2Client }from 'google-auth-library';
import user from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { name, email, sub:googleId, picture } = payload;

        let User = await user.findOne({ googleId });
        if (!User) {
            user = await User.create({ googleId, name, email, picture });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.err('Google Auth Error:', err);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
};