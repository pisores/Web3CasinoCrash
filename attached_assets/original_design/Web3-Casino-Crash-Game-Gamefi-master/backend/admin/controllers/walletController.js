const models = require('../../models/index');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Web3 = require('web3');
const TronWeb = require('tronweb');
const { INFURA_OPTION, NETWORK, TRONWEB_OPTION } = require('../../config');
const tatumController = require('./tatumController');
const web3 = new Web3(INFURA_OPTION[NETWORK].providerUrl);
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(TRONWEB_OPTION[NETWORK].providerUrl);
const solidityNode = new HttpProvider(TRONWEB_OPTION[NETWORK].providerUrl);
const eventServer = new HttpProvider(TRONWEB_OPTION[NETWORK].providerUrl);
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

const getBalanceFromInfura = async (address) => {
    const balance = await web3.eth.getBalance(address);
    return balance;
}

const getBalanceFromTronWeb = async (address) => {
    const balance = await tronWeb.trx.getBalance(address);
    return balance;
}

const getBalanceFromTatum = async (address) => {
    const balance = await tatumController.getBtcBalanceFromAddress(address);
    return balance.incoming;
}

const getBalanceFromAddress = async (address, coinType) => {
    if (coinType === 'ETH') {
        const balance = await getBalanceFromInfura(address);
        return balance / 10 ** 18;
    }
    else if (coinType === 'TRX') {
        const balance = await getBalanceFromTronWeb(address);
        return balance / 10 ** 6;
    }
    else if (coinType === 'BTC') {
        const balance = await getBalanceFromTatum(address);
        return balance;
    }
}

exports.getWalletList = async (req, res) => {
    try {
        const { coinType } = req.body;

        let balanceData = {};
        if (coinType === 'All') {
            balanceData['BTC'] = await tatumController.getBalanceFromAccount({ coinType: 'BTC' });
            balanceData['ETH'] = await tatumController.getBalanceFromAccount({ coinType: 'ETH' });
            balanceData['TRX'] = await tatumController.getBalanceFromAccount({ coinType: 'TRON' });
        }
        else {
            balanceData[coinType] = await tatumController.getBalanceFromAccount({ coinType: coinType === 'TRX' ? 'TRON' : coinType });
        }

        let match;
        if (coinType !== 'All')
            match = { currency: coinType };
        else
            match = {};

        const walletData = await models.walletModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $match: match
            },
            {
                $project: {
                    userId: '$userId',
                    userName: '$userData.userNickName',
                    address: '$address',
                    coinType: '$currency',
                    createdAt: '$createdAt'
                }
            }
        ]);

        return res.json({ status: true, data: walletData, balance: balanceData });
    }
    catch (err) {
        console.error({ title: 'walletController => getWalletList', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.getWalletDetail = async (req, res) => {
    try {
        const { id } = req.body;

        const depositList = await models.walletModel.aggregate([
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'address',
                    foreignField: 'to',
                    as: 'transactionData'
                }
            },
            {
                $match: {
                    _id: ObjectId(id)
                }
            },
            {
                $unwind: '$transactionData'
            },
            {
                $project: {
                    txId: '$transactionData.txId',
                    amount: '$transactionData.amount',
                    currency: '$currency',
                    from: '$transactionData.from',
                    to: '$transactionData.to',
                    date: '$transactionData.date'
                }
            }
        ]);
        const withdrawList = await models.walletModel.aggregate([
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'address',
                    foreignField: 'from',
                    as: 'transactionData'
                }
            },
            {
                $match: {
                    _id: ObjectId(id)
                }
            },
            {
                $unwind: '$transactionData'
            },
            {
                $project: {
                    txId: '$transactionData.txId',
                    amount: '$transactionData.amount',
                    currency: '$currency',
                    from: '$transactionData.from',
                    to: '$transactionData.to',
                    date: '$transactionData.date'
                }
            }
        ]);

        const walletDetail = await models.walletModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $match: {
                    _id: ObjectId(id)
                }
            },
            {
                $project: {
                    address: '$address',
                    currency: '$currency',
                    createdAt: '$createdAt',
                    userName: '$userData.userNickName'
                }
            }
        ]);
        const walletBalance = await getBalanceFromAddress(walletDetail[0].address, walletDetail[0].currency);

        return res.json({ status: true, data: { depositList, withdrawList, walletDetail, walletBalance } });
    }
    catch (err) {
        console.error({ title: 'walletController => getWalletDetail', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.withdrawFromAddress = async (req, res) => {
    try {
        const { from, to, amount, fee, coinType } = req.body;
        if (!from || !to || !amount || !fee || !coinType)
            return res.json({ status: false, message: 'Invalid Request' });

        const walletData = await models.walletModel.findOne({ address: from, currency: coinType });
        if (coinType === 'TRX') {
            const response = await tatumController.withdrawTRONFromAccount({ address: to, amount, derivationKey: walletData.derivationKey, myAddress: from, currency: coinType });
            return res.json({ status: true, data: response });
        }
        else if (coinType === 'ETH') {
            const response = await tatumController.withdrawETHFromAccount({ address: to, amount, derivationKey: walletData.derivationKey, myAddress: from, currency: coinType });
            return res.json({ status: true, data: response });
        }
        else if (coinType === 'BTC') {
            const response = await tatumController.withdrawBTCFromAccount({ address: to, amount, myAddress: from, currency: coinType });
            return res.json({ status: true, data: response });
        }
    }
    catch (err) {
        console.error({ title: 'walletController => withdrawFromAddress', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.getSeedData = async (req, res) => {
    try {
        const userSeedData = await models.seedModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'userId',
                    as: 'userData'
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $match: {
                    type: 'client'
                }
            }
        ]);
        const serverSeedData = await models.seedModel.find({ type: 'server' }).sort({ date: -1 });
        return res.json({ status: true, data: userSeedData.concat(serverSeedData) });
    }
    catch (err) {
        console.error({ title: 'walletController => getSeedData', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.newServerSeed = async (req, res) => {
    try {
        const { seed } = req.body;
        if (!seed) return res.json({ statue: false, message: 'Seed value is empty.' });
        await new models.seedModel({
            seed,
            type: 'server',
            date: new Date()
        }).save();
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'walletController => newServerSeed', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.insertCurrency = async (req, res) => {
    try {
        const { currencyName, decimal, fullName, token, available } = req.body;
        if (!currencyName || !decimal || !fullName) return res.json({ status: false, message: 'Invalid Request' });

        const data = await models.currencyListModel.findOne({ currencyName, token });
        if (data) return res.json({ status: false, message: 'Same currency is already exist!' });

        await new models.currencyListModel({ currencyName, decimal, fullName, token, available }).save();
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'WalletController => insertCurrency', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.removeCurrency = async (req, res) => {
    try {
        const { currencyId } = req.body;
        if (!currencyId) return res.json({ status: false, message: 'Invalid Request' });

        await models.currencyListModel.findOneAndDelete({ _id: currencyId });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'WalletController => removeCurrency', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.updateCurrency = async (req, res) => {
    try {
        const { _id, currencyName, decimal, fullName, token, available, withdrawable, swapable } = req.body;
        if (!_id) return res.json({ status: false, message: 'Invalid Request' });

        // const data = await models.currencyListModel.findOne({ currencyName, _id: { $ne: _id } });
        // if (data) return res.json({ status: false, message: 'Same currency is already exist!' })

        await models.currencyListModel.findOneAndUpdate({ _id: _id }, { currencyName, decimal, fullName, token, available, withdrawable, swapable });
        return res.json({ status: true });
    }
    catch (err) {
        console.error({ title: 'WalletController => updateCurrency', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}

exports.readCurrency = async (req, res) => {
    try {
        const response = await models.currencyListModel.find();
        return res.json({ status: true, data: response });
    }
    catch (err) {
        console.error({ title: 'WalletController => readCurrency', message: err.message });
        return res.json({ status: false, message: 'Server Error' });
    }
}