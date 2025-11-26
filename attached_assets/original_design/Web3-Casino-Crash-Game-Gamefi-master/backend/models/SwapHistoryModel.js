const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    swapId: { type: String, default: '' },
    swapAmount: { type: Number, default: 0 },
    swappedAmount: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    from: { type: String, default: '' },
    to: { type: String, default: '' },
    date: { type: Date, default: Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SwapHistory', ModelSchema);