const Axios = require('axios');
const config = require('../../config');
const models = require('../../models/index');

const TatumAxios = Axios.create();
TatumAxios.defaults.timeout = 20000;
TatumAxios.defaults.baseURL = 'https://api.tatum.io/v3';
TatumAxios.defaults.headers.common['x-api-key'] = config.TATUM_OPTION[config.NETWORK].apikey;
TatumAxios.defaults.headers.common['Content-Type'] = 'application/json';
TatumAxios.defaults.headers.post['Content-Type'] = 'application/json';

exports.getBalanceFromAccount = async (data) => {
    try {
        const { coinType } = data;
        const keyName = `${coinType}WalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            const response = await TatumAxios.get(`/ledger/account/${accountInfo.dataObject.virtualAccount.id}/balance`);
            return response.data;
        }
        else {
            console.log({ title: 'tatumController - getAccountBalance', message: 'AccountInfo Null' });
            return null;
        }
    }
    catch (err) {
        console.error({ title: 'tatumController - getAccountBalance', message: err.message });
        return null;
    }
}

exports.getBtcBalanceFromAddress = async (address) => {
    const balance = await TatumAxios.get(`/bitcoin/address/balance/${address}`);
    return balance.data;
}

exports.createBitcoinWallet = async () => {
    try {
        const response = await TatumAxios.get('/bitcoin/wallet');
        const { mnemonic, xpub } = response.data;
        return { mnemonic, xpub };
    }
    catch (err) {
        console.error({ title: 'tatumController - createBitCoinAccount', message: err.message });
        return null;
    }
}

exports.withdrawBTCFromAccount = async (data) => {
    try {
        const { address, amount, myAddress, currency } = data;
        const keyName = `BTCWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            const request = {
                senderAccountId: accountInfo.dataObject.virtualAccount.id,
                address: address,
                amount: Number(Number(amount).toString()).toFixed(8).toString(),
                mnemonic: accountInfo.dataObject.mnemonic,
                xpub: accountInfo.dataObject.xpub,
            }
            const response = await TatumAxios.post(`/offchain/bitcoin/transfer`, JSON.stringify(request));
            if (response.data.completed) {
                await new models.transactionModel({
                    accountId: accountInfo.dataObject.virtualAccount.id,
                    amount: Number(amount),
                    reference: '',
                    currency: currency,
                    txId: response.data.txId,
                    from: myAddress,
                    to: address,
                    date: new Date(),
                    index: '',
                    subscriptionType: '#'
                }).save();
            }
            return response.data;
        }
        else {
            console.log({ title: 'tatumController - withdrawBTCFromAccount', message: 'AccountInfo Null' });
            return null;
        }
    }
    catch (err) {
        console.error({ title: 'tatumController - withdrawBTCFromAccount', message: err.message });
        return null;
    }
}

exports.createEthereumWallet = async () => {
    try {
        const response = await TatumAxios.get('/ethereum/wallet');
        const { mnemonic, xpub } = response.data;
        return { mnemonic, xpub };
    }
    catch (err) {
        console.error({ title: 'tatumController - createEthereumAccount', message: err.message });
        return null;
    }
}

exports.withdrawETHFromAccount = async (data) => {
    try {
        const { address, amount, derivationKey, myAddress, currency } = data;
        const keyName = `ETHWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            console.log(accountInfo);
            const request = {
                senderAccountId: accountInfo.dataObject.virtualAccount.id,
                address: address,
                amount: Number(amount).toString(),
                index: derivationKey,
                mnemonic: accountInfo.dataObject.mnemonic
            }
            const response = await TatumAxios.post(`/offchain/ethereum/transfer`, JSON.stringify(request));
            if (response.data.completed) {
                await new models.transactionModel({
                    accountId: accountInfo.dataObject.virtualAccount.id,
                    amount: Number(amount),
                    reference: '',
                    currency: currency,
                    txId: response.data.txId,
                    from: myAddress,
                    to: address,
                    date: new Date(),
                    index: '',
                    subscriptionType: '#'
                }).save();
            }
            return response.data;
        }
        else {
            console.log({ title: 'tatumController - withdrawETHFromAccount', message: 'AccountInfo Null' });
            return null;
        }
    }
    catch (err) {
        console.error({ title: 'tatumController - withdrawETHFromAccount', message: err.message });
        return null;
    }
}

exports.createTronWallet = async () => {
    try {
        const response = await TatumAxios.get('/tron/wallet');
        const { mnemonic, xpub } = response.data;
        return { mnemonic, xpub };
    }
    catch (err) {
        console.error({ title: 'tatumController - createTronWallet', message: err.message });
        return null;
    }
}

exports.withdrawTRONFromAccount = async (data) => {
    try {
        const { address, amount, derivationKey, myAddress, currency } = data;
        const keyName = `TRONWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            const request = {
                senderAccountId: accountInfo.dataObject.virtualAccount.id,
                address: address,
                amount: Number(amount).toString(),
                mnemonic: accountInfo.dataObject.mnemonic,
                index: derivationKey
            }
            const response = await TatumAxios.post(`/offchain/tron/transfer`, JSON.stringify(request));
            if (response.data.completed) {
                await new models.transactionModel({
                    accountId: accountInfo.dataObject.virtualAccount.id,
                    amount: Number(amount),
                    reference: '',
                    currency: currency,
                    txId: response.data.txId,
                    from: myAddress,
                    to: address,
                    date: new Date(),
                    index: '',
                    subscriptionType: '#'
                }).save();
            }
            return response.data;
        }
        else {
            console.log({ title: 'tatumController - withdrawTRONFromAccount', message: 'AccountInfo Null' });
            return null;
        }
    }
    catch (err) {
        console.error({ title: 'tatumController - withdrawTRONFromAccount', message: err.message });
        return null;
    }
}