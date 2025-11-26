import { Close, CopyAllSharp } from "@mui/icons-material";
import { Modal, Box, IconButton, Button, FormControl, Select, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useEffect, useState, useContext } from "react";
import { getDepositAddress, withdraw } from "redux/actions/payment";
import { useSelector, useDispatch } from "react-redux";
// import Config from "config/index";
import { useToasts } from "react-toast-notifications";
import { getMyBalances } from "redux/actions/auth";
import { LoadingContext } from "layout/Context/loading";
import SwapContainer from "views/components/swap";
import HistoryContainer from "views/components/history";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '100px',
        width: '827px',
        // height: '800px',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px',
        "@media (max-width: 681px)": {
            width: '100%',
            borderRadius: '0px'
        }
    },
    ModalBodyBox: {
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: '20px'
    },
    CloseButton: {
        position: 'absolute',
        top: '-32px',
        right: '-32px',
        width: '64px',
        height: '64px',
        color: '#55556F',
        background: '#2C2C3A',
        border: '6px solid #24252D',
        "&:hover": {
            background: '#2C2C3AEE'
        },
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            right: 'unset',
            left: '50%'
        }
    },
    TitleBox: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 900,
        fontSize: "32px",
        lineHeight: "49px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        opacity: 0.5
    },
    PageOptionBox: {
        width: '100%',
        height: '54px',
        // padding: '5px',
        // background: '#1a2c38',
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px'
    },
    PageOptionButton: {
        color: '#FFF',
        textTransform: 'uppercase',
        fontSize: '15px',
        fontWeight: '700',
        height: '100%',
        width: '141px',
        borderRadius: '8px'
    },
    SelectedOption: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%);',
        // color: 'rgb(26 44 56)'
    },
    DepositCoinBox: {
        width: '100%',
        height: '50px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '3px 10px',
        border: 'solid 2px #1a2c38',
        borderRadius: '5px'
    },
    CurrencyBlock: {
        marginBottom: '20px',
        color: '#FFF',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer'
    },
    CurrencyIcon: {
        width: '16px',
        height: '16px'
    },
    CurrencyLabel: {
        textTransform: 'uppercase'
    },
    CurrencyCode: {
        padding: '0px 5px',
        borderRadius: '5px',
        fontSize: '13px',
        fontWeight: 'bold',
        background: '#768691',
        display: 'inline-block',
        marginLeft: '10px'
    },
    CurrencyDetail: {
        display: 'flex',
        alignItems: 'bottom',
        justifyContent: 'flex-start',
        gap: '5px'
    },
    DropDownIcon: {
        position: 'absolute',
        top: '12px',
        right: '5px'
    },
    CurrencyTitle: {
        margin: '10px 0px'
    },
    DepositBalanceBlock: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3px 10px',
        border: 'solid 1px #424253',
        borderRadius: '5px'
    },
    AmountInputWrapper: {
        borderRadius: '5px',
        backgroundColor: '#424253',
        position: 'relative',
        width: '100%'
    },
    AmountInput: {
        background: 'transparent',
        outline: 'none',
        border: 'none',
        color: '#FFF',
        fontWeight: '700',
        fontSize: '14px',
        width: '100%',
        height: '100%',
        padding: '10px 60px 10px 28px'
    },
    AmountInputUtils: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        inset: '0px 16px 0px 8px',
        pointerEvents: 'none'
    },
    AmountMaxButton: {
        textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
        pointerEvents: 'all',
        color: '#bbb3b3',
        "&:hover": {
            color: '#FFF'
        }
    },
    DepositBalanceTitle: {
        margin: '5px 0px'
    },
    AmountContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px'
    },
    DepositButton: {
        padding: '0px 1rem',
        borderRadius: '5px',
        "&>span": {
            textTransform: 'uppercase',
            fontWeight: '700',
            fontSize: '16px'
        },
        background: 'linear-gradient(rgb(249, 253, 255) 0%, rgb(207, 226, 234) 100%)',
        color: 'rgb(26 44 56)',
        "&:disabled": {
            color: 'rgb(26 44 56)',
            opacity: '0.5'
        }
    },
    WithdrawButton: {
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
    WithdrawButtonBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    CurrencyIconSmall: {
        width: '12px',
        height: '12px'
    },
    DepositText: {
        marginTop: '10px',
        fontWeight: 'lighter',
        fontSize: '14px'
    },
    DepositTextWhite: {
        color: 'white',
        fontWeight: 'bold'
    },
    DepositTextLightYellow: {
        color: 'rgb(252, 195, 129)',
        fontWeight: 'bold'
    },
    AddressRemoveButton: {
        background: '#FFF',
        borderRadius: '5px',
        pointerEvents: 'all'
    },
    CurrencyBlockRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '3px 0px'
    },
    CopyAllButton: {
        color: '#FFF',
        pointerEvents: 'all'
    },
    CustomSelect: {
        background: '#424253',
        color: '#FFF',
        "&>svg.MuiSvgIcon-root": {
            color: '#FFF'
        },
        "&>.MuiSelect-select": {
            borderRadius: 7,
            background: '#424253',
            color: '#FFF',
            fontSize: '14px',
            fontWeight: '700',
            // border: 'solid 2px #1a2c38',
            padding: '0px 10px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '5px'
        }
    },
    CustomMenuItem: {
        color: '#FFF',
        display: 'flex',
        gap: '5px',
        fontSize: '14px',
        fontWeight: '700',
        padding: '10px 16px',
        "&>span": {
            textTransform: 'uppercase'
        }
    },
    CustomSelectWithdraw: {
        "&>.MuiSelect-select": {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
        }
    },
    CustomMenuItemWithdraw: {
        color: '#FFF',
        display: 'flex',
        gap: '5px',
        fontSize: '14px',
        fontWeight: '700',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '50px'
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    }
}));

const WalletModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const userData = useSelector((state) => state.authentication.userData);
    const balanceData = useSelector((state) => state.authentication.balanceData);
    const currencyData = useSelector((state) => state.currencyOption);
    const currencies = currencyData.currencies;

    const [pageType, setPageType] = useState(0);

    const [depositAddress, setDepositAddress] = useState('');
    const [depositCurrencyType, setDepositCurrencyType] = useState(0);

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [withdrawCurrencyType, setWithdrawCurrencyType] = useState(0);

    const handleClose = () => setOpen(false);

    // useEffect(() => {
    //     Config?.Root?.socket?.off("depositSuccess");
    //     Config?.Root?.socket?.on("depositSuccess", (data) => {
    //         console.log(data);
    //         if (data.userId === userData?._id) {
    //             addToast('Deposit Successfully Completed', { appearance: 'success', autoDismiss: true });
    //             loadBalanceData();
    //         }
    //     });
    //     // eslint-disable-next-line
    // }, [userData]);

    useEffect(() => {
        if (pageType === 1) loadBalanceData();
        else if (pageType === 0) loadDepositAddress();
        // eslint-disable-next-line
    }, [open, pageType, depositCurrencyType, withdrawCurrencyType]);

    const loadDepositAddress = async () => {
        if (open) {
            showLoading();
            const request = { coinType: currencies[depositCurrencyType].name, type: currencies[depositCurrencyType].token, userId: userData?._id };
            const response = await getDepositAddress(request);
            if (response.status) {
                setDepositAddress(response.data.address);
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
                setDepositAddress('');
            }
            hideLoading();
        }
    };

    const loadBalanceData = async () => {
        const request = { userId: userData?._id };
        const response = await getMyBalances(request);
        if (response.status) {
            dispatch({ type: 'SET_BALANCEDATA', data: response.data.data });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
    }

    const handlePageType = (type) => {
        setPageType(type);
    };

    const handleWithdrawAmount = (e) => {
        setWithdrawAmount(e.target.value);
    };

    const handleWithdrawAddress = (e) => {
        setWithdrawAddress(e.target.value);
    };

    const handleCopyAddress = () => {
        window.navigator.clipboard.writeText(depositAddress);
    };

    const handleWithdraw = async () => {
        const request = { coinType: currencies[withdrawCurrencyType], amount: Number(withdrawAmount), address: withdrawAddress, userId: userData?._id };
        console.log(request);
        const response = await withdraw(request);
        if (response.status) {
            addToast(`Withdraw successfully done.`, { appearance: 'success', autoDismiss: true });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
    };

    const handleDepositCurrency = (e) => {
        setDepositCurrencyType(e.target.value);
    };

    const handleWithdrawCurrency = (e) => {
        setWithdrawCurrencyType(e.target.value);
    };

    const onClickMaxButton = () => {
        if (withdrawCurrencyType === 0) setWithdrawAmount(balanceData[withdrawCurrencyType].balance - 0.00005);
        else if (withdrawCurrencyType === 1) setWithdrawAmount(balanceData[withdrawCurrencyType].balance - 0.0005);
        else if (withdrawCurrencyType === 2) setWithdrawAmount(balanceData[withdrawCurrencyType].balance - 0.0005);
        else if (withdrawCurrencyType === 3) setWithdrawAmount(balanceData[withdrawCurrencyType].balance - 3);
        else setWithdrawAmount(balanceData[withdrawCurrencyType].balance);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            slotProps={{ backdrop: { className: classes.backdrop } }}
        >
            <Box className={classes.ModalBox}>
                <Box className={classes.ModalBodyBox}>
                    <IconButton className={classes.CloseButton} onClick={handleClose}>
                        <Close />
                    </IconButton>
                    <Box className={classes.TitleBox}>
                        Wallet
                    </Box>
                    <Box className={classes.PageOptionBox}>
                        <Button
                            onClick={() => handlePageType(0)}
                            className={pageType === 0 ? clsx(classes.PageOptionButton, classes.SelectedOption) : classes.PageOptionButton}
                        >
                            Deposit
                        </Button>
                        <Button
                            onClick={() => handlePageType(1)}
                            className={pageType === 1 ? clsx(classes.PageOptionButton, classes.SelectedOption) : classes.PageOptionButton}
                        >
                            Withdraw
                        </Button>
                        <Button
                            onClick={() => handlePageType(2)}
                            className={pageType === 2 ? clsx(classes.PageOptionButton, classes.SelectedOption) : classes.PageOptionButton}
                        >
                            Swap
                        </Button>
                        <Button
                            onClick={() => handlePageType(3)}
                            className={pageType === 3 ? clsx(classes.PageOptionButton, classes.SelectedOption) : classes.PageOptionButton}
                        >
                            History
                        </Button>
                    </Box>
                    {
                        pageType === 0 &&
                        <Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>Currency Type</Box>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="currencyType"
                                        id="currencyType"
                                        value={depositCurrencyType}
                                        onChange={handleDepositCurrency}
                                        className={classes.CustomSelect}
                                    >
                                        {
                                            currencies.map((currency, index) => currency.withdrawable && (
                                                <MenuItem key={index} value={index} className={classes.CustomMenuItem}>
                                                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency.name.toLowerCase()}.png`} alt='icon' />
                                                    <span>{currency.name} {(currency.token === 'native' || currency.token === '') ? '' : `(${currency.token})`}</span>
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>Deposit Address</Box>
                                <Box className={classes.DepositBalanceBlock}>
                                    <span className={classes.DepositBalanceTitle}>
                                        Address
                                    </span>
                                    <Box className={classes.AmountContainer}>
                                        <Box className={classes.AmountInputWrapper}>
                                            <input className={classes.AmountInput} value={depositAddress} onChange={(e) => setDepositAddress(e.target.value)} disabled />
                                            <Box className={classes.AmountInputUtils}>
                                                <Box></Box>
                                                <IconButton onClick={handleCopyAddress} className={classes.CopyAllButton}><CopyAllSharp /></IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    }
                    {
                        pageType === 1 &&
                        <Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>Withdraw from</Box>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="currencyType"
                                        id="currencyType"
                                        value={withdrawCurrencyType}
                                        onChange={handleWithdrawCurrency}
                                        className={clsx(classes.CustomSelect, classes.CustomSelectWithdraw)}
                                    >
                                        {
                                            currencies.map((currency, index) => currency.withdrawable && (
                                                <MenuItem key={index} value={index} className={clsx(classes.CustomMenuItem, classes.CustomMenuItemWithdraw)}>
                                                    <span className={classes.CurrencyLabel}>
                                                        <span>{currency.name} {(currency.token === 'native' || currency.token === '') ? '' : `(${currency.token})`}</span>
                                                    </span>
                                                    <span className={classes.CurrencyDetail}>
                                                        <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency.name.toLowerCase()}.png`} alt='icon' />
                                                        <span>{Number(balanceData[index]?.balance).toFixed(currency.decimal)}</span>
                                                    </span>
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>{currencies[withdrawCurrencyType].fullname} {currencies[withdrawCurrencyType].token !== '' ? `(${currencies[withdrawCurrencyType].token})` : ''}</Box>
                                <Box className={classes.DepositBalanceBlock}>
                                    <span className={classes.DepositBalanceTitle}>
                                        Address
                                    </span>
                                    <Box className={classes.AmountContainer}>
                                        <Box className={classes.AmountInputWrapper}>
                                            <input className={classes.AmountInput} value={withdrawAddress} onChange={handleWithdrawAddress} />
                                            <Box className={classes.AmountInputUtils}>
                                                <Box></Box>
                                                {
                                                    withdrawAddress !== '' &&
                                                    <IconButton onClick={() => setWithdrawAddress('')} className={classes.AddressRemoveButton}><Close /></IconButton>
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.CurrencyTitle}>{currencies[withdrawCurrencyType].fullname} {currencies[withdrawCurrencyType].token !== '' ? `(${currencies[withdrawCurrencyType].token})` : ''}</Box>
                                <Box className={classes.DepositBalanceBlock}>
                                    <span className={clsx(classes.DepositBalanceTitle, classes.CurrencyDetail)}>
                                        Amount
                                        (Balance: <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currencies[withdrawCurrencyType].name.toLowerCase()}.png`} alt="icon" />
                                        {Number(balanceData[withdrawCurrencyType].balance).toFixed(currencies[withdrawCurrencyType].decimal)}
                                        )
                                    </span>
                                    <Box className={classes.AmountContainer}>
                                        <Box className={classes.AmountInputWrapper}>
                                            <input className={classes.AmountInput} value={withdrawAmount} onChange={handleWithdrawAmount} />
                                            <Box className={classes.AmountInputUtils}>
                                                <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currencies[withdrawCurrencyType].name.toLowerCase()}.png`} alt="icon" />
                                                <span className={classes.AmountMaxButton} onClick={onClickMaxButton}>Max</span>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className={classes.CurrencyBlock}>
                                <Box className={classes.DepositBalanceBlock}>
                                    {/* <Box className={classes.CurrencyBlockRow}>
                                        <span>Minimum</span>
                                        <Box className={classes.CurrencyDetail}>
                                            <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currencies[withdrawCurrencyType].name.toLowerCase()}.png`} alt="icon" />
                                            0.00010000
                                        </Box>
                                    </Box> */}
                                    <Box className={classes.CurrencyBlockRow}>
                                        <span>Fee</span>
                                        <Box className={classes.CurrencyDetail}>
                                            <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currencies[withdrawCurrencyType].name === 'BTC' ? 'btc' :
                                                currencies[withdrawCurrencyType].name === 'ETH' || currencies[withdrawCurrencyType].token === "erc-20" ? 'eth' :
                                                    currencies[withdrawCurrencyType].name === 'BNB' || currencies[withdrawCurrencyType].token === "bep-20" ? 'bnb' :
                                                        'trx'}.png`} alt="icon" />
                                            {
                                                currencies[withdrawCurrencyType].name === 'BTC' ? 0.00005 :
                                                    currencies[withdrawCurrencyType].name === 'ETH' || currencies[withdrawCurrencyType].token === "erc-20" ? 0.0005 :
                                                        currencies[withdrawCurrencyType].name === 'BNB' || currencies[withdrawCurrencyType].token === "bep-20" ? 0.0005 :
                                                            15
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box className={classes.WithdrawButtonBox}>
                                <Button className={classes.WithdrawButton} onClick={handleWithdraw}>
                                    <span>Withdraw</span>
                                </Button>
                            </Box>
                        </Box>
                    }
                    {
                        pageType === 2 &&
                        <SwapContainer />
                    }
                    {
                        pageType === 3 &&
                        <HistoryContainer />
                    }
                </Box>
            </Box>
        </Modal>
    );
};

export default WalletModal;