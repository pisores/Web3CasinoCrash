const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    historyId: { type: String, default: '' },
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    count: { type: Number, default: 0.0 },
    reason: { type: String, default: '' },
    date: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SpinHistoryModel', ModelSchema);