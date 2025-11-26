const Axios = require('axios');
const config = require('../config');
const models = require('../models/index');
const Tatum = require('@tatumio/tatum');
const ethers = require('ethers');

const TatumAxios = Axios.create();
TatumAxios.defaults.timeout = 20000;
TatumAxios.defaults.baseURL = 'https://api.tatum.io/v3';
TatumAxios.defaults.headers.common['x-api-key'] = config.TATUM_OPTION[config.NETWORK].apikey;
TatumAxios.defaults.headers.common['Content-Type'] = 'application/json';
TatumAxios.defaults.headers.post['Content-Type'] = 'application/json';

const NativeData = {
    'erc-20': 'ETH',
    'bep-20': 'BNB',
    'trc-20': 'TRX'
};

const createSubscription = async (data, subscriptionType = Tatum.SubscriptionType.ADDRESS_TRANSACTION) => {
    try {
        const { address, chain, url } = data;
        const request = {
            type: subscriptionType,
            attr: {
                address,
                chain,
                url
            }
        };
        const response = await TatumAxios.post('/subscription', JSON.stringify(request));
        console.log("createSubscription=========", response.data);
    }
    catch (err) {
        console.error({ title: 'tatumController - createSubscription', message: err.message });
        return null;
    }
}

const getNetworkFromCoinType = (coinType) => {
    if (coinType.toUpperCase() === 'BTC') return 'bitcoin';
    else if (coinType.toUpperCase() === 'ETH') return 'ethereum';
    else if (coinType.toUpperCase() === 'TRX') return 'tron';
    else if (coinType.toUpperCase() === 'BNB') return 'bsc';
}

const generatePrivateKey = async (data) => {
    try {
        const { mnemonic, index, chain } = data;
        const response = await TatumAxios.post(`/${chain}/wallet/priv`, JSON.stringify({ index, mnemonic }));
        return response.data;
    }
    catch (err) {
        console.error({ title: 'tatumController - generatePrivateKey', message: err.message });
        return '';
    }
}

exports.getNativeData = async (data) => {
    try {
        const { type } = data;
        return NativeData[type];
    }
    catch (err) {
        console.error({ title: 'tatumController - getNativeData', message: err.message });
        return '';
    }
}

exports.createVirtualAccount = async (data) => {
    try {
        const { xpub, coinType } = data;
        const request = {
            currency: coinType,
            xpub: xpub,
            customer: {
                accountingCurrency: 'USD',
                customerCountry: 'US',
                externalId: config.TATUM_OPTION[config.NETWORK].virtualAccount,
                providerCountry: 'US'
            },
            compliant: true,
            accountCode: config.TATUM_OPTION[config.NETWORK].virtualAccount,
            accountingCurrency: 'USD',
            accountNumber: config.TATUM_OPTION[config.NETWORK].virtualAccount
        };
        const response = await TatumAxios.post('/ledger/account', JSON.stringify(request));
        return response.data;
    }
    catch (err) {
        console.error({ title: 'tatumController - createVirtualAccount', message: err.message });
        return null;
    }
}

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

exports.getDepositAddressFromAccount = async (data) => {
    try {
        const { coinType } = data;
        const keyName = `${coinType === 'TRX' ? 'TRON' : coinType === 'BNB' ? 'BSC' : coinType}WalletInfo`;
        console.log(keyName)
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            const chain = getNetworkFromCoinType(coinType);
            // console.log(chain)
            // console.log(accountInfo.dataObject.virtualAccount.id)
            const addressData = await TatumAxios.post(`/offchain/account/${accountInfo.dataObject.virtualAccount.id}/address`);
            // console.log(addressData)
            const privateKey = await generatePrivateKey({ index: addressData.data.derivationKey, chain, mnemonic: accountInfo.dataObject.mnemonic });
            await createSubscription({ url: config.SUBSCRIBE_URL, chain: addressData.data.currency, address: addressData.data.address });
            return { ...addressData.data, ...privateKey };
        }
        else {
            console.log({ title: 'tatumController - getDepositAddressFromAccount', message: 'AccountInfo Null' });
            return null;
        }
    }
    catch (err) {
        console.error({ title: 'tatumController - getDepositAddressFromAccount', message: err.message });
        return null;
    }
}

exports.getGasPrice = async (data) => {
    try {
        const { coinType } = data;
        const response = await TatumAxios.get(`/blockchain/fee/${coinType}`);
        return response.data;
    }
    catch (err) {
        console.error({ title: 'tatumController - getGasPrice', message: err.message });
        return null;
    }
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
        const { address, amount, myAddress, currency, privateKey } = data;
        const keyName = `BTCWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            const request = {
                fromAddress: [
                    {
                        address: myAddress,
                        privateKey: privateKey
                    }
                ],
                to: [
                    {
                        address: address,
                        value: Number(amount)
                    }
                ],
                fee: '0.00005',
                changeAddress: address
            }
            const response = await TatumAxios.post(`/bitcoin/transaction`, JSON.stringify(request));
            console.log(response);
            if (response.data.txId) {
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
        const { address, amount, derivationKey, myAddress, currency, privateKey } = data;
        const keyName = `ETHWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            const request = {
                to: address,
                amount: Number(amount).toString(),
                currency: currency.token === 'native' ? 'ETH' : currency.name,
                fromPrivateKey: privateKey
            }
            const response = await TatumAxios.post(`/ethereum/transaction`, JSON.stringify(request));
            if (response.data.txId) {
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
        const { address, amount, derivationKey, myAddress, currency, privateKey } = data;
        const keyName = `TRONWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            let request;
            let response;
            if (currency.token === 'native') {
                request = {
                    fromPrivateKey: privateKey,
                    to: address,
                    amount: Number(amount).toString()
                }
                response = await TatumAxios.post(`/tron/transaction`, JSON.stringify(request));
            } else {
                request = {
                    fromPrivateKey: privateKey,
                    to: address,
                    tokenAddress: currency.name === "USDT" ? 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' : "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
                    feeLimit: 15,
                    amount: Number(amount).toString()
                }
                console.log("Tron Request ================", request);
                response = await TatumAxios.post(`/tron/trc20/transaction`, JSON.stringify(request));
            }
            console.log(response);
            if (response.data.txId) {
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

exports.createBSCWallet = async () => {
    try {
        const response = await TatumAxios.get('/bsc/wallet');
        const { mnemonic, xpub } = response.data;
        return { mnemonic, xpub };
    }
    catch (err) {
        console.error({ title: 'tatumController - createTronWallet', message: err.message });
        return null;
    }
}

exports.withdrawBNBFromAccount = async (data) => {
    try {
        const { address, amount, derivationKey, myAddress, currency, privateKey } = data;
        const keyName = `BSCWalletInfo`;
        const accountInfo = await models.settingModel.findOne({ key: keyName });
        if (accountInfo) {
            let request;
            let response;
            console.log(accountInfo);
            if (currency.token === 'native') {
                request = {
                    to: address,
                    currency: 'BSC',
                    amount: Number(amount).toString(),
                    fromPrivateKey: privateKey,
                };
                response = await TatumAxios.post(`/bsc/transaction`, JSON.stringify(request));
            } else if (currency.name === 'USDC') {
                request = {
                    to: address,
                    currency: 'USDC_BSC',
                    amount: Number(amount).toString(),
                    fromPrivateKey: privateKey,
                };
                response = await TatumAxios.post(`/bsc/transaction`, JSON.stringify(request));
            } else {
                const BSCProvider = new ethers.providers.JsonRpcProvider(
                    config.BINANCE_URL[config.NETWORK].providerUrl
                );
                const wallet = new ethers.Wallet(privateKey, BSCProvider);
                const contract = new ethers.Contract(
                    "0x55d398326f99059fF775485246999027B3197955",
                    config.BINANCE_ABI,
                    wallet
                );
                let approveResult = await contract.approve(myAddress, Number(Number(amount) * 10 ** 18).toString());
                console.log("=======================Approve : ", approveResult);
                if (approveResult) {
                    let txid = await contract.transferFrom(myAddress, address, Number(Number(amount) * 10 ** 18).toString(), {
                        gasLimit: 210000
                    });
                    console.log(txid);
                    response = {
                        data: {
                            txId: txid.hash
                        }
                    };
                }
            }
            console.log(response);
            if (response.data.txId) {
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
            console.log({ title: 'tatumController - withdrawBNBFromAccount', message: 'AccountInfo Null' });
            return null;
        }
    }
    catch (err) {
        console.error({ title: 'tatumController - withdrawBNBFromAccount', message: err.message });
        return null;
    }
}