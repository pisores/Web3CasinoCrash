const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    roundNumber: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object },
    rewardData: { type: Array },
    roundResult: { type: String, default: '' },
    payout: { type: Number, default: 0 },
    clientSeed: { type: String, default: '' },
    serverSeed: { type: String, default: '' },
    roundDate: { type: Date, default: new Date() },
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SlotRound', ModelSchema);