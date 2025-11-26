const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    count: { type: Number, default: 1 },
    availableDate: { type: Date },
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserSpins', ModelSchema);