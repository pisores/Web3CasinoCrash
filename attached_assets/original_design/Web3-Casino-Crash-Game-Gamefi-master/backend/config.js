module.exports = {
    SERVER_PORT: 5000,
    JWT: {
        expireIn: '1h',
        secret: 'PLAYZELOSECRET'
    },
    DB: 'mongodb+srv://victoryfox1116:kzBPFHRoRfxdDGVO@cluster0.iknukbk.mongodb.net/PlayZelo?authSource=admin&replicaSet=atlas-10v8gb-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
    MANAGEMENT_OPTION: {
        port: 4000
    },
    TATUM_OPTION: {
        testnet: {
            apikey: 't-64ddb376ba1bfa001cda4484-64de0f87946f4c001cc79647',
            virtualAccount: 'PlayZeloPaymentTestnet',
            withdrawFee: '0.00001'
        },
        mainnet: {
            apikey: 't-64ddb376ba1bfa001cda4484-64de0f6a143e73001c21f64d',
            virtualAccount: 'PlayZeloPaymentMainnet',
            withdrawFee: '0.00001'
        }
    },
    INFURA_OPTION: {
        testnet: {
            providerUrl: 'https://sepolia.infura.io/v3/69b01f7c51d044c0a7883220a2104df3'
        },
        mainnet: {
            providerUrl: 'https://mainnet.infura.io/v3/69b01f7c51d044c0a7883220a2104df3'
        }
    },
    TRONWEB_OPTION: {
        testnet: {
            providerUrl: 'https://api.shasta.trongrid.io'
        },
        mainnet: {
            providerUrl: 'https://api.trongrid.io'
        }
    },
    BINANCE_URL: {
        testnet: {
            providerUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545'
        },
        mainnet: {
            providerUrl: 'https://bsc-dataseed.binance.org/'
        }
    },
    BINANCE_ABI: [
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    NETWORK: 'mainnet',
    // SUBSCRIBE_URL: 'http://212.24.111.179:5000/api/v0/payment/webhook-handler',
    SUBSCRIBE_URL: 'https://backend.memewarsx.com/api/v0/payment/webhook-handler',
    DEV_MDOE: false
};