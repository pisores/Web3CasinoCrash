const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    roundNumber: { type: String, default: '' },
    fairResult: { type: Number, default: 1 },
    roundDate: { type: Date, default: new Date() },
    serverSeed: { type: String, default: '' },
    roundStatus: { type: Number, enum: [0, 1, 2, 3], default: 0 }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CrashRounds', ModelSchema);