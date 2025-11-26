const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../admin/config');

const ModelSchema = mongoose.Schema({
    username: { type: String, trim: true, required: [true, 'Please enter a username value.'] },
    sitename: { type: String, trim: true },
    password: { type: String, required: [true, 'Please nter a password value.'] },
    authKey: { type: String, required: [true, 'Please enter a authkey value'] },
    balance: { type: Number, default: 0 },
    customerId: { type: String, trim: true, unique: true, required: [true, 'Please enter a customerId value'] },
    website: { type: String, required: [true, 'Please enter a website value'] },
    callbackUrl: { type: String, trim: true, required: [true, 'Please enter a callbackUrl value'] },
    token: { type: String, default: '' },
    OTP: {
        active: { type: Boolean, default: false },
        secret: { type: String, default: '' }
    },
    timestamp: { type: Number, default: 0 },
    type: { type: String, enum: ["admin", "customer"], default: 'customer' },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

ModelSchema.methods.updateToken = function (Token) {
    this.token = Token;
    this.timestamp = new Date();
    return this.save();
};

ModelSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, JWT.decode(this.password).password);
};

ModelSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password'))
            return next();

        this.password = JWT.sign({ password: bcrypt.hashSync(this.password, bcrypt.genSaltSync(10)) }, config.jwt.secret);
        return next();
    }
    catch (err) {
        console.error({ title: 'adminUserSave', message: err.message });
    }
});

module.exports = mongoose.model('admin_users', ModelSchema);