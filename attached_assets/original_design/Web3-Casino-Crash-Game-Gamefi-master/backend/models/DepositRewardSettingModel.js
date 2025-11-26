const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    depositCount: { type: Number, enum: [1, 2, 3, 4], default: 1, required: true },
    amountLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low', required: true },
    startAmount: { type: Number, default: 0, required: true },
    endAmount: { type: Number, default: 0, required: true },
    percent: { type: Number, default: 0, required: true },
    date: { type: Date, default: new Date(), required: true }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DepositRewardSetting', ModelSchema);