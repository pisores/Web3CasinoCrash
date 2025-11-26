const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    gameType: { type: String },
    roundNumber: { type: String, default: '' },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object, default: {} },
    payout: { type: Number, default: 0 },
    roundResult: { type: String, default: '' },
    roundState: { type: Boolean, default: true },
    date: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BetHistory', ModelSchema);