const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    roundNumber: { type: String, default: '' },
    roundResult: { type: String, enum: ['finish', 'lost', 'payout'], default: 'finish' },
    roundDate: { type: Date, default: new Date() },
    minesCount: { type: Number, default: 2 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object },
    payout: { type: Number, default: 1 },
    clientSeed: { type: String, default: '' },
    serverSeed: { type: String, default: '' },
    resultBoard: { type: String, default: '' },
    selectBoard: { type: String, default: '' }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('MinesRound', ModelSchema);