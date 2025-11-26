const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    animation: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    backgroundSound: { type: Boolean, default: true },
    effectSound: { type: Boolean, default: true },
    hotkey: { type: Boolean, default: false },
    maxBet: { type: Boolean, default: false }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('GameSetting', ModelSchema);