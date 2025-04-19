import mongoose from 'mongoose';

const wallet = new mongoose.Schema({
    userId: {
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

module.exports = mongoose.model('crypto', wallet);