const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    historyId: { type: String, default: '' },
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    rewardType: { type: String, enum: ['user', 'admin'], default: 'user' },
    rewardAmount: { type: Number, default: 0.0 },
    rewardReason: { type: String, default: '' },
    depositAmount: { type: Number, default: 0.0 },
    depositCoinType: { type: String, default: 'ZELO' },
    date: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('RewardHistoryModel', ModelSchema);