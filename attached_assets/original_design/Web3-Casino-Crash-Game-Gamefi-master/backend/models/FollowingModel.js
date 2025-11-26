const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    fromUserId: { type: mongoose.Types.ObjectId, ref: 'users' },
    toUserId: { type: mongoose.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Following', ModelSchema);