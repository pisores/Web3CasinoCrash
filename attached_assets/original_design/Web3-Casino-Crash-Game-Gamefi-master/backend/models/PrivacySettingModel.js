const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    privateProfile: { type: Boolean, default: true },
    contactMe: { type: Number, default: 2 },
    showOnlineIndicator: { type: Boolean, default: true }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('PrivacySetting', ModelSchema);