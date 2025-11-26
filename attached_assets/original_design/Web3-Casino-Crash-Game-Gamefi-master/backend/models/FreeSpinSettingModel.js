const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    startLevel: { type: Number, default: 0, required: true },
    endLevel: { type: Number, default: 0, required: true },
    count: { type: Number, default: 0, required: true },
    date: { type: Date, default: new Date(), required: true }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('FreeSpinSetting', ModelSchema);