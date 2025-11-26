import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { getTransactionHistory } from "redux/actions/auth";
import { useSelector } from "react-redux";
import { useState } from "react";

const useStyles = makeStyles(() => ({
    MainLayout: {
        padding: 33
    },
    ListLayout: {
        background: '#424253',
        width: '100%',
        padding: 20,
        borderRadius: 7
    },
    TransactionRow: {
        background: '#2C2C3A',
        borderRadius: 7,
        width: '100%',
        height: 50,
        marginBottom: 7,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 5
    },
    TransactionCoinIcon: {
        width: 32,
        height: 32
    },
    TransactionAmount: {
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        fontWeight: 700,
        width: '100%',
    },
    TransactionCoinTypeBox: {
        background: '#2C2C3A',
        padding: '0px 5px',
        borderRadius: 4,
        fontWeight: 'bold',
        color: '#EC4F5B',
        textTransform: 'uppercase',
        fontSize: 13,
        whiteSpace: 'pre',
        border: 'solid 1px #363646'
    }
}));

const HistoryContainer = () => {
    const classes = useStyles();

    const authData = useSelector((state) => state.authentication);
    const currencyData = useSelector((state) => state.currencyOption);
    const currencies = currencyData.currencies;

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        if (authData.isAuth) {
            const request = {
                userId: authData.userData._id
            };
            const response = await getTransactionHistory(request);
            if (response.status) {
                let _transactions = [...transactions];
                // eslint-disable-next-line
                response.data.map((walletData) => {
                    // eslint-disable-next-line
                    walletData.transactionData.map((transaction) => {
                        const currencyData = currencies.find((item) => item.name === transaction.currency.coinType && item.token === transaction.currency.type);
                        const pushData = {
                            currencyData,
                            amount: transaction.amount,
                            txId: transaction.txId
                        };
                        _transactions.push(pushData);
                    })
                });
                console.log(_transactions);
                setTransactions([..._transactions]);
            }
        }
    };

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.ListLayout}>
                {
                    transactions.map((item, index) => (
                        <Box key={index} className={classes.TransactionRow}>
                            <img className={classes.TransactionCoinIcon} src={`/assets/images/coins/${item.currencyData.name.toLowerCase()}.png`} alt='icon' />
                            <span className={classes.TransactionAmount}>
                                {
                                    item.amount.toFixed(item.currencyData.decimal)
                                }
                            </span>
                            <Box className={classes.TransactionCoinTypeBox}>
                                {
                                    (item.currencyData.token === 'native' || item.currencyData.token === '') ? item.currencyData.name
                                        : `${item.currencyData.name}(${item.currencyData.token})`
                                }
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
};

export default HistoryContainer;