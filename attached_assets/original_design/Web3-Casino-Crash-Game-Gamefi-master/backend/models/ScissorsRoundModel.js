const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    roundNumber: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object, default: {} },
    betNumber: { type: Number, enum: [0, 1, 2], default: 0 },
    winNumber: { type: Number, enum: [0, 1, 2], default: 0 },
    roundResult: { type: String, enum: ['win', 'lost', 'draw'] },
    payout: { type: Number, default: 1.98 },
    clientSeed: { type: String, default: '' },
    serverSeed: { type: String, default: '' },
    roundDate: { type: Date, default: new Date() },
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ScissorsRound', ModelSchema);