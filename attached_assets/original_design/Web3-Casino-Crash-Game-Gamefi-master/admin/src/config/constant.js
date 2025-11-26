export const COINTYPES = {
    BTC: { code: 'BTC', fullname: 'Bitcoin', token: '', decimal: 8 },
    ETH: { code: 'ETH', fullname: 'Ethereum', token: 'erc20', decimal: 6 },
    TRX: { code: 'TRX', fullname: 'TRON', token: 'trc20', decimal: 6 },
    ZELO: { code: 'ZELO', fullname: 'PlayZelo', token: 'erc20', decimal: 4 }
};

export const CURRENCIES = {
    BTC: 'BTC',
    ETH: 'ETH',
    TRX: 'TRX',
    ZELO: 'ZELO'
}

export const Fee = {
    BTC: 0.0000001,
    ETH: 0.00001,
    TRX: 10,
    ZELO: 1
}

export const TxScanLink = {
    Mainnet: {
    },
    Testnet: {
        BTC: 'https://sochain.com/tx/BTCTEST/',
        ETH: 'https://sepolia.etherscan.io/tx/',
        TRX: 'https://shasta.tronscan.org/#/transaction/'
    }
}

export const AddressScanLink = {
    Mainnet: {
        BTC: 'https://sochain.com/address/BTC/',
        ETH: 'https://etherscan.io/address/',
        TRX: 'https://tronscan.org/#/address/'
    },
    Testnet: {
        BTC: 'https://sochain.com/address/BTCTEST/',
        ETH: 'https://sepolia.etherscan.io/address/',
        TRX: 'https://shasta.tronscan.org/#/address/'
    }
}

export const NETWORK = 'Testnet';