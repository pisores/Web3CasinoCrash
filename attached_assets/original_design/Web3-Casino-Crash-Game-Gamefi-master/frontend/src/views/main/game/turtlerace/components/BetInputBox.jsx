import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TurtleSocketManager from "../TurtleSocketManager";
import { useToasts } from "react-toast-notifications";
import { getMyBalances } from "redux/actions/auth";

const MaxAmount = 1000;

const useStyles = makeStyles(() => ({
    BetInputBoxContainer: {
        maxWidth: '653px',
        width: '653px',
        height: '243px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/assets/images/turtle/Action_Bg.png")',
        backgroundSize: '100% 243px',
        backgroundRepeat: 'no-repeat',
        marginLeft: 'auto',
        marginRight: 'auto',
        "@media (max-width: 1444px)": {
            width: '100%',
            maxWidth: '100%',
            height: 150
        },
        "@media (max-width: 681px)": {
            backgroundImage: 'unset',
            backgroundColor: '#592B9B',
            padding: '0px 14px'
        }
    },
    BetInputBoxWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexDirection: 'column',
        "@media (max-width: 1444px)": {
            gap: '8px'
        },
        "@media (max-width: 681px)": {
            width: '100%'
        }
    },
    TurtleSelectBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        "@media (max-width: 681px)": {
            width: '100%',
            gap: 8
        }
    },
    TurtleButton: {
        display: 'flex',
        width: '179px',
        height: '48px',
        borderRadius: '4px',
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        fontWeight: '900',
        fontSize: '15px',
        justifyContent: 'space-between',
        backgroundSize: '100% 100%',
        textTransform: 'uppercase',
        "&>div": {
            backgroundImage: 'url("/assets/images/turtle/Payout_Amount.png")',
            backgroundSize: '69px 32.5px',
            color: '#1F1E25',
            fontFamily: 'Styrene A Web',
            fontWeight: '700',
            fontSize: '17px',
            width: '69px',
            height: '32.5px',
            "@media (max-width: 1444px)": {
                height: 22,
                fontSize: 12,
                lineHeight: '21px'
            },
            "@media (max-width: 681px)": {
                flex: 'none',
                width: '50px'
            }
        },
        "@media (max-width: 1444px)": {
            height: 33
        },
        "@media (max-width: 681px)": {
            width: '100%',
            fontSize: '11px',
            lineHeight: '14px',
            padding: '3px 4px'
        }
    },
    YellowButton: {
        backgroundImage: 'url("/assets/images/turtle/Payout_Yellow.png")',
    },
    ActivedYellow: {
        boxShadow: '0 0 24px #ff9314',
        opacity: '1'
    },
    RedButton: {
        backgroundImage: 'url("/assets/images/turtle/Payout_Red.png")'
    },
    ActivedRed: {
        boxShadow: '0 0 24px #f23068',
        opacity: '1'
    },
    BlueButton: {
        backgroundImage: 'url("/assets/images/turtle/Payout_Blue.png")'
    },
    ActivedBlue: {
        boxShadow: '0 0 24px #0d42ff',
        opacity: '1'
    },
    AmountInputBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: '#1f0d53',
        borderRadius: '4px',
        width: '100%',
        backgroundImage: 'url("/assets/images/turtle/Bet_Amount.png")',
        backgroundSize: 'cover'
    },
    BetAmountInput: {
        color: '#fff',
        background: 'unset',
        border: 'unset',
        width: '100%',
        fontSize: '18px',
        fontWeight: 'bold',
        outline: 'none',
        padding: '1px',
        display: 'inline-block'
    },
    InputActionButtons: {
        fontSize: '16px',
        height: '56px',
        backgroundColor: '#7A5C5C',
        color: '#FFF',
        padding: '0px',
        minWidth: '48px',
        width: '67px',
        borderRadius: '0px',
        "@media (max-width: 1444px)": {
            height: 33,
            width: 40,
            minWidth: 40
        }
    },
    BetButton: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#FFFFFF'
    },
    CancelButton: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#ffffff'
    },
    BetButtonsBox: {
        width: '100%',
        height: '53px',
        backgroundImage: 'url("/assets/images/turtle/Button_Play.png")',
        backgroundSize: '100% 100%',
        "@media (max-width: 1444px)": {
            height: 33
        }
    },
    InputBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px',
        marginLeft: '20px',
        "&>img": {
            width: '40px',
            height: '40px',
            "@media (max-width: 1444px)": {
                width: 30,
                height: 30
            }
        }
    }
}));

let myBet = false;
let myTurtleNum = 0;
let authenticationData = null;

const BetInputBox = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { addToast } = useToasts();
    const authData = useSelector((state) => state.authentication);
    const currency = authData.isAuth ? authData.userData.currency : '';

    const [turtleNum, setTurtleNum] = useState(0);
    const [betAmount, setBetAmount] = useState(100);

    const [betState, setBetState] = useState('bet');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [confirmButton, setConfirmButton] = useState(false);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        return () => {
            window.removeEventListener('message', onWindowMessage);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        authenticationData = authData;
    }, [authData]);

    useEffect(() => {
        if (betAmount > MaxAmount) {
            setBetAmount(MaxAmount);
        }
    }, [betAmount]);

    const handleTurtleNum = (num) => {
        setTurtleNum(num);
        myTurtleNum = num;
    };

    const handleBetAmount = (e) => {
        setBetAmount(e.target.value);
    };

    const updateBetAmount = (amount) => {
        setBetAmount(amount);
    };

    const handleJoinBet = () => {
        if (authData.isAuth) {
            setConfirmButton(true);
            const request = {
                userId: authData.userData._id,
                betAmount: betAmount,
                coinType: currency,
                turtleNum: turtleNum
            };
            TurtleSocketManager.getInstance().joinBet(request);
        }
        else {
            addToast('Please login and try again', { appearance: 'warning', autoDismiss: true });
        }
    };

    const handleCancelBet = () => {
        if (authData.isAuth) {
            setConfirmButton(true);
            const request = {
                userId: authData.userData._id
            };
            TurtleSocketManager.getInstance().cancelBet(request);
        }
        else {
            addToast('Please login and try again', { appearance: 'warning', autoDismiss: true });
        }
    };

    const onWindowMessage = async (event) => {
        if (event?.data?.type === 'playzelo-joinBetResult') {
            setConfirmButton(false);
            const result = event?.data?.data;
            if (result.state && result.data.status) {
                setBetState('cancel');
                myBet = true;
                dispatch({ type: 'SET_BALANCEDATA', data: result.data.data.data });
            }
            else if (!result.data.status) {
                addToast(result.data.message, { appearance: 'error', autoDismiss: true });
            }
        }
        if (event?.data?.type === 'playzelo-cancelBetResult') {
            setConfirmButton(false);
            const result = event?.data?.data;
            if (result.state && result.data.status) {
                myBet = false;
                setBetState('bet');
                dispatch({ type: 'SET_BALANCEDATA', data: result.data.data.data });
            }
        }
        if (event?.data?.type === 'playzelo-roundStart') {
            setButtonDisabled(true);
        }
        if (event?.data?.type === 'playzelo-roundStop') {
            setButtonDisabled(false);
            setBetState('bet');
            let winTurtle = event.data.data.findIndex((item) => item === 0);
            if (myBet) {
                if (winTurtle === myTurtleNum) {
                    addToast('You won this round', { appearance: 'success', autoDismiss: true });
                }
                else {
                    addToast('You lost this round', { appearance: 'warning', autoDismiss: true });
                }
            }
        }
        if (event?.data?.type === 'playzelo-roundFinished') {
            myBet = false;
        }
        if (event?.data?.type === 'playzelo-balanceUpdated') {
            TurtleSocketManager.getInstance().getCurrentRound();
            const response = await getMyBalances({ userId: authenticationData?.userData?._id });
            if (response.status) {
                dispatch({ type: 'SET_BALANCEDATA', data: response.data.data });
            }
        }
        if (event?.data?.type === 'playzelo-currentRoundState') {
            const stateData = event.data.data;
            if (stateData.state === 'started') {
                setButtonDisabled(true);
            }
        }
    };

    return (
        <Box className={classes.BetInputBoxContainer}>
            <Box className={classes.BetInputBoxWrapper}>
                <Box className={classes.TurtleSelectBox}>
                    <Button disabled={buttonDisabled} onClick={() => handleTurtleNum(0)} className={clsx(classes.TurtleButton, classes.YellowButton, turtleNum === 0 ? classes.ActivedYellow : '')}>
                        <span>Yellow</span>
                        <Box>2.94</Box>
                    </Button>
                    <Button disabled={buttonDisabled} onClick={() => handleTurtleNum(1)} className={clsx(classes.TurtleButton, classes.RedButton, turtleNum === 1 ? classes.ActivedRed : '')}>
                        <span>Red</span>
                        <Box>2.94</Box>
                    </Button>
                    <Button disabled={buttonDisabled} onClick={() => handleTurtleNum(2)} className={clsx(classes.TurtleButton, classes.BlueButton, turtleNum === 2 ? classes.ActivedBlue : '')}>
                        <span>Blue</span>
                        <Box>2.94</Box>
                    </Button>
                </Box>
                <Box className={classes.BetButtonsBox}>
                    {
                        betState === 'bet' &&
                        <Button className={classes.BetButton} onClick={handleJoinBet} disabled={buttonDisabled || confirmButton}>Bet</Button>
                    }
                    {
                        betState === 'cancel' &&
                        <Button className={classes.CancelButton} onClick={handleCancelBet} disabled={buttonDisabled || confirmButton}>Cancel</Button>
                    }
                </Box>
                <Box className={classes.AmountInputBox}>
                    <Box className={classes.InputBox}>
                        <img src={`/assets/images/coins/${currency.coinType.toLowerCase()}.png`} alt="icon" />
                        <input value={betAmount} onChange={handleBetAmount} className={classes.BetAmountInput} disabled={buttonDisabled} />
                    </Box>
                    <Box style={{ flex: 'none' }}>
                        <Button disabled={buttonDisabled} className={classes.InputActionButtons} style={{ background: '#4D3C6A' }} onClick={() => updateBetAmount(betAmount / 2)}>½</Button>
                        <Button disabled={buttonDisabled} className={classes.InputActionButtons} onClick={() => updateBetAmount(betAmount * 2)}>2x</Button>
                        <Button disabled={buttonDisabled} className={classes.InputActionButtons} style={{ background: '#4D3C6A' }} onClick={() => updateBetAmount(MaxAmount)}>Max</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BetInputBox;