import mongoose from 'mongoose';

const plaidSchema = new mongoose.Schema({
    email: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true }
});

export default mongoose.model('plaidItem', plaidSchema);