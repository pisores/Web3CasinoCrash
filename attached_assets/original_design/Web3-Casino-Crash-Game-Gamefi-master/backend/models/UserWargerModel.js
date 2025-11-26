const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    totalWargerAmount: { type: Number, default: 0 },
    claimedWargerAmount: { type: Number, default: 0 },
    campaignClaimAmount: { type: Number, default: 0 }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserWarger', ModelSchema);