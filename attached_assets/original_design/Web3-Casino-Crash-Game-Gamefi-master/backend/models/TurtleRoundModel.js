const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    roundNumber: { type: String, default: '' },
    winnerInfo: { type: Array },
    roundDate: { type: Date, default: new Date() },
    serverSeed: { type: String, default: '' }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TurtleRounds', ModelSchema);