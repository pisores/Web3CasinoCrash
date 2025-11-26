const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    gameName: { type: String, default: '' },
    available: { type: Boolean, default: true },
    gameLink: { type: String, default: '/' },
    regDate: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('GameList', ModelSchema);