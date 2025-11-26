const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    type: { type: String, enum: ['top', 'bottom'], default: 'top' },
    text1: { type: String, default: '' },
    text2: { type: String, default: '' },
    text3: { type: String, default: '' }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BannetText', ModelSchema);