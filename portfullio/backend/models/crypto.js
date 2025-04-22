import mongoose from 'mongoose';

const wallet = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model('crypto', wallet);