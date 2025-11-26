const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    rewardDate: { type: Date, default: Date() },
    rewardAmount: { type: Number, default: 10 },
    rewardToken: { type: String, enum: ['BTC', 'ETH', 'TRX', 'ZELO'], default: 'ZELO' }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DailyReward', ModelSchema);