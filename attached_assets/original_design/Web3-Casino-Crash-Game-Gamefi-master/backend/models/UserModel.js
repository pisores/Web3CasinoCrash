const mongoose = require('mongoose');

const balanceObject = {
    data: [
        { coinType: 'BTC', balance: 0, chain: 'BTC', type: 'native' },
        { coinType: 'ETH', balance: 0, chain: 'ETH', type: 'native' },
        { coinType: 'BNB', balance: 0, chain: 'BNB', type: 'native' },
        { coinType: 'TRX', balance: 0, chain: 'TRON', type: 'native' },
        { coinType: 'USDT', balance: 0, chain: 'ETH', type: 'erc-20' },
        { coinType: 'USDT', balance: 0, chain: 'BNB', type: 'bep-20' },
        { coinType: 'USDT', balance: 0, chain: 'TRON', type: 'trc-20' },
        { coinType: 'USDC', balance: 0, chain: 'ETH', type: 'erc-20' },
        { coinType: 'USDC', balance: 0, chain: 'BNB', type: 'bep-20' },
        { coinType: 'USDC', balance: 0, chain: 'TRON', type: 'trc-20' },
        { coinType: 'ZELO', balance: 0, chain: '', type: '' }
    ]
}

const ModelSchema = mongoose.Schema({
    userName: { type: String },
    userAvatar: { type: String, default: 'avatar1.png' },
    userLevel: { type: Number, default: '0' },
    userEmail: { type: String },
    userPassword: { type: String },
    userToken: { type: String },
    loginType: { type: String, enum: ['Google', 'Wallet', 'Email', 'Apple'], default: 'Email' },
    userNickName: { type: String, required: [true, 'Please input userNickName'] },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    balance: { type: Object, default: balanceObject },
    address: { type: Object },
    currency: { type: Object, default: { coinType: 'BTC', type: 'native' } },
    profileSet: { type: Boolean, default: false },
    campaignCode: { type: String, default: '' },
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

ModelSchema.methods.updateToken = function (token) {
    this.token = token;
    return this.save();
}

module.exports = mongoose.model('Users', ModelSchema);