const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    enable: { type: Boolean, default: true },
    percent: { type: Number, default: 2 }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('UnlockSetting', ModelSchema);