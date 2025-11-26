const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    code: { type: String, default: '' },
    type: { type: String, enum: ['default', 'custom'], default: 'default' },
    name: { type: String, default: 'default' }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CampaignCode', ModelSchema);