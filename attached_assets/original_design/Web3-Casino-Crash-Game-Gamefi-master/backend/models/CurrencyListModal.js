const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    currencyName: { type: String, default: '' },
    decimal: { type: Number, default: 4 },
    fullName: { type: String, default: '' },
    token: { type: String, default: '' },
    available: { type: Boolean, default: true },
    withdrawable: { type: Boolean, default: true },
    swapable: { type: Boolean, default: true },
    regDate: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CurrencyList', ModelSchema);