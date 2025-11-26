const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    roundNumber: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object },
    difficulty: { type: Number, default: 0 },
    isOver: { type: Boolean, default: true },
    payout: { type: Number, default: 1.98 },
    fairData: { type: Object, default: { l: 1, r: 1 } },
    roundResult: { type: String, enum: ['win', 'lost'] },
    clientSeed: { type: String, default: '' },
    serverSeed: { type: String, default: '' },
    roundDate: { type: Date, default: new Date() },
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DiceRound', ModelSchema);