const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    crashRoundId: { type: mongoose.Schema.Types.ObjectId, ref: 'crashrounds' },
    betUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    payout: { type: Number, default: 0 },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object },
    seed: { type: String, default: '' }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CrashBetHistory', ModelSchema);