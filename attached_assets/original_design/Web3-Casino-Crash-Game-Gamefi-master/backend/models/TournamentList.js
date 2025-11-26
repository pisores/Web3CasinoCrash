const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    prizePoolAmount: { type: Number, default: '' },
    prizePoolCoinType: { type: String, default: 'ZELO' },
    winnerPercent1: { type: Number, default: 0 },
    winnerPercent2: { type: Number, default: 0 },
    winnerPercent3: { type: Number, default: 0 },
    winnerPercentN: { type: Number, default: 0 },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date, default: new Date() },
    finished: { type: Boolean, default: false },
    priceAmount: { type: Number, default: 100 }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TournamentList', ModelSchema);