const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    seed: { type: String, required: true },
    type: { type: String, required: true, enum: ['server', 'client'], default: 'client' },
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Seed', ModelSchema);