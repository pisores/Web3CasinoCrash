const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'tournamentlists' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    regDate: { type: Date, default: new Date() },
    wargerAmount: { type: Number, default: 0 },
    participateAmount: { type: Number, default: 0 },
    coinType: { type: String, default: 'ZELO' },
    rating: { type: Number, default: 0 },
    prizeAmount: { type: Number, default: 0 }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TournamentUser', ModelSchema);