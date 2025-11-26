import { Button, FormControl, MenuItem, Select, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getExchangeRate, swapCoin } from "redux/actions/payment";

const useStyles = makeStyles(() => ({
    MainLayout: {
        padding: 33
    },
    SwapSubBox: {
        display: 'flex',
        gap: 10,
        marginBottom: 31,
        alignItems: 'flex-end'
    },
    SwapFormBox: {
        width: '100%'
    },
    SwapFormTitle: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 15,
        lineHeight: '19px',
        textTransform: 'uppercase',
        color: '#95959C',
        marginBottom: 15
    },
    CustomSelect: {
        background: '#424253',
        color: '#FFF',
        height: 71,
        "&>svg.MuiSvgIcon-root": {
            color: '#FFF'
        },
        "&>.MuiSelect-select": {
            borderRadius: 7,
            background: '#424253',
            padding: '9px 16px',
            display: 'flex',
            gap: '6px',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            "&>span": {
                fontFamily: 'Styrene A Web',
                fontSize: 13,
                lineHeight: '17px',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#FFF'
            }
        }
    },
    CustomMenuItem: {
        color: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '14px',
        fontWeight: '700',
        padding: '9px 16px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        "&>span": {
            fontFamily: 'Styrene A Web',
            fontSize: 13,
            lineHeight: '17px',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: '#FFF'
        }
    },
    CurrencyIcon: {
        width: '28px',
        height: '28px'
    },
    BalanceBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#FFF'
    },
    BalanceLabel: {
        color: '#6FE482',
        fontFamily: 'Styrene A Web',
        fontSize: 15,
        lineHeight: '19px',
        textTransform: 'uppercase',
        fontWeight: 700,
        "&>img": {
            width: 23,
            height: 23,
            marginLeft: 5,
            marginRight: 5
        }
    },
    BalanceInputBox: {
        width: '100%',
        height: 71,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0px 18px 0px 16px',
        backgroundColor: '#424253',
        borderRadius: 7,
        "&>img": {
            width: 28
        }
    },
    DisabledInputBox: {
        opacity: 0.5
    },
    BalanceInput: {
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#FFF',
        width: '100%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        marginLeft: 8
    },
    MaxButton: {
        fontFamily: 'Styrene A Web',
        fontSize: 15,
        lineHeight: '19px',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#FFF'
    },
    SwapButton: {
        height: '50px',
        width: '250px',
        borderRadius: '5px',
        "&>span": {
            textTransform: 'uppercase',
            fontWeight: '700',
            fontSize: '18px'
        },
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        color: '#FFF',
        "&:disabled": {
            color: '#FFF',
            opacity: '0.5'
        }
    },
    SwapButtonBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    SwapRateText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 15,
        lineHeight: '19px',
        textTransform: 'uppercase',
        color: '#FFF',
        marginBottom: 20,
        "&>span": {
            color: '#6FE482'
        }
    }
}));

const SwapContainer = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const userData = useSelector((state) => state.authentication.userData);
    const balanceData = useSelector((state) => state.authentication.balanceData);
    const currencyData = useSelector((state) => state.currencyOption);
    const currencies = currencyData.currencies;

    const [exchangeRate, setExchangeRate] = useState(0);
    const fromIndex = currencies.findIndex(item => item.swapable);
    const toIndex = currencies.findIndex(item => item.withdrawable);

    const [fromCurrency, setFromCurrency] = useState(fromIndex >= 0 ? fromIndex : 0);
    const [toCurrency, setToCurrency] = useState(toIndex >= 0 ? toIndex : 0);

    const [swapAmount, setSwapAmount] = useState(0);
    const [swapedAmount, setSwapedAmount] = useState(0);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, [fromCurrency, toCurrency]);

    useEffect(() => {
        if (exchangeRate !== 0) {
            const convertedAmount = swapAmount * exchangeRate;
            setSwapedAmount(convertedAmount);
        }
        // eslint-disable-next-line
    }, [exchangeRate, swapAmount]);

    const initFunc = async () => {
        showLoading();
        const request = { from: currencies[fromCurrency].name, to: currencies[toCurrency].name }
        const response = await getExchangeRate(request);
        if (response.status) {
            setExchangeRate(Number(response.data));
            setSwapAmount(0);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    }

    const handleFromCurrency = (e) => {
        setFromCurrency(e.target.value);
    };

    const handleToCurrency = (e) => {
        setToCurrency(e.target.value);
    };

    const handleSwapAmount = (value) => {
        if (value > Number(balanceData[fromCurrency].balance)) {
            setSwapAmount(Number(balanceData[fromCurrency].balance));
        }
        else {
            setSwapAmount(value);
        }
    };

    const handleSwapedAmount = (value) => {
        setSwapedAmount(value);
    };

    const handleSwap = async () => {
        showLoading();
        const request = {
            from: currencies[fromCurrency].name,
            to: currencies[toCurrency].name,
            amount: swapAmount,
            userId: userData._id,
            fromType: currencies[fromCurrency].token,
            toType: currencies[toCurrency].token
        };
        const response = await swapCoin(request);
        if (response.status) {
            addToast('Successfully done!', { appearance: 'success', autoDismiss: true });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box className={classes.MainLayout}>
            <Typography className={classes.SwapRateText}>Swap Rate: <span>{exchangeRate.toFixed(6)}</span></Typography>
            <Box className={classes.SwapSubBox}>
                <Box className={classes.SwapFormBox}>
                    <Typography className={classes.SwapFormTitle}>Swap From {currencies[fromCurrency].name} {(currencies[fromCurrency].token === 'native' || currencies[fromCurrency].token === '') ? '' : `(${currencies[fromCurrency].token})`}</Typography>
                    <FormControl fullWidth>
                        <Select
                            labelId="currencyType"
                            id="currencyType"
                            value={fromCurrency}
                            onChange={handleFromCurrency}
                            className={classes.CustomSelect}
                        >
                            {
                                currencies.map((currency, index) => currency.swapable && (
                                    <MenuItem key={index} value={index} className={classes.CustomMenuItem}>
                                        <span>{currency.fullName}</span>
                                        <Box className={classes.BalanceBox}>
                                            <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency.name.toLowerCase()}.png`} alt='icon' />
                                            <span>{Number(balanceData[index].balance).toFixed(currency.decimal)}</span>
                                        </Box>
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className={classes.SwapFormBox}>
                    <Typography className={classes.SwapFormTitle}>Amount
                        <span className={classes.BalanceLabel}>
                            &nbsp;(&nbsp;Balance:
                            <img src={`/assets/images/coins/${currencies[fromCurrency].name.toLowerCase()}.png`} alt={currencies[fromCurrency].name} />
                            {
                                Number(balanceData[fromCurrency].balance).toFixed(currencies[fromCurrency].decimal)
                            }
                            &nbsp;)
                        </span>
                    </Typography>
                    <Box className={classes.BalanceInputBox}>
                        <img src={`/assets/images/coins/${currencies[fromCurrency].name.toLowerCase()}.png`} alt={currencies[fromCurrency].name} />
                        <input type="number" className={classes.BalanceInput} value={swapAmount} onChange={(e) => handleSwapAmount(e.target.value)} />
                        <Button className={classes.MaxButton}>Max</Button>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.SwapSubBox}>
                <Box className={classes.SwapFormBox}>
                    <Typography className={classes.SwapFormTitle}>Swap To {currencies[toCurrency].name} {(currencies[toCurrency].token === 'native' || currencies[toCurrency].token === '') ? '' : `(${currencies[toCurrency].token})`}</Typography>
                    <FormControl fullWidth>
                        <Select
                            labelId="currencyType"
                            id="currencyType"
                            value={toCurrency}
                            onChange={handleToCurrency}
                            className={classes.CustomSelect}
                        >
                            {
                                currencies.map((currency, index) => currency.withdrawable && (
                                    <MenuItem key={index} value={index} className={classes.CustomMenuItem}>
                                        <Box className={classes.BalanceBox}>
                                            <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency.name.toLowerCase()}.png`} alt='icon' />
                                            <span>{Number(balanceData[index].balance).toFixed(currency.decimal)}</span>
                                        </Box>
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className={classes.SwapFormBox}>
                    <Typography className={classes.SwapFormTitle}>Amount</Typography>
                    <Box className={clsx(classes.BalanceInputBox, classes.DisabledInputBox)}>
                        <img src={`/assets/images/coins/${currencies[toCurrency].name.toLowerCase()}.png`} alt={currencies[toCurrency].name} />
                        <input disabled className={classes.BalanceInput} value={swapedAmount} onChange={(e) => handleSwapedAmount(e.target.value)} />
                    </Box>
                </Box>
            </Box>
            <Box className={classes.SwapButtonBox}>
                <Button className={classes.SwapButton} onClick={handleSwap}>
                    <span>Swap</span>
                </Button>
            </Box>
        </Box>
    );
};

export default SwapContainer;