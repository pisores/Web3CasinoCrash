const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    label: { type: String, default: '', required: [true, 'Please input label'] },
    data: { type: Array, default: [] }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UserLevel', ModelSchema);