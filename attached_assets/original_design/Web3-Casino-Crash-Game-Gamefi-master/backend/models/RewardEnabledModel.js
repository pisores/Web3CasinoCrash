const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    enabled: { type: Boolean, default: true }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('RewardEnabled', ModelSchema);