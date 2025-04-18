const mongoose = require('mongoose');

const plaidSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accessToken: { type: String, required: true },
    itemId: { type: String, required: true },
    institutionName: String,
    accounts: [
    {
        accountId: String,
        name: String,
        type: String,
        subtype: String,
        mask: String,
        balances: {
            available: Number,
            current: Number,
            isoCurrencyCode: String
        }
    }
    ]
});

module.exports = mongoose.model('plaidItem', plaidSchema);