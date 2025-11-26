const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    turtleRoundId: { type: mongoose.Schema.Types.ObjectId, ref: 'turtle_rounds' },
    betUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    turtleNumber: { type: Number, enum: [0, 1, 2], default: 0 },
    xFactor: { type: Number, default: 0 },
    betAmount: { type: Number, default: 0 },
    coinType: { type: Object },
    isWin: { type: Boolean, default: false }
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TurtleBetHistory', ModelSchema);