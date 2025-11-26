const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    emailAddress: { type: String, default: '' },
    code: { type: String, default: '' },
    date: { type: Date, default: new Date() }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AuthenticationCodes', ModelSchema);