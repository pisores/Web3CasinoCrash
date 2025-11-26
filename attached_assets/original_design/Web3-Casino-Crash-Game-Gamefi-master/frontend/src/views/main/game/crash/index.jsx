import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HistoryBox from "./utils/HistoryBox";
import SettingBox from "views/components/setting";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { LoadingButton } from "@mui/lab";
import { CrashApp } from "./CrashApp";
import { ReactComponent as UserListIcon } from "assets/icons/user-list.svg";
import CrashSocketManager from "./utils/CrashSocketManager";
import { BET_STATUS, GAME_STATE } from "./data/Constant";
import useSound from "use-sound";
import BgSound from "assets/sounds/crash/background.mp3";
import ExplosionSound from "assets/sounds/crash/explosion.mp3";
import FlyingSound from "assets/sounds/crash/flying.mp3";
import ClickSound from "assets/sounds/slot/click.mp3";

const useStyles = makeStyles(() => ({
    MainContainer: {
        width: '100%',
        paddingRight: 54,
        "@media (max-width: 940px)": {
            padding: 0
        }
    },
    GamePanel: {
        width: '100%',
        height: 829,
        borderRadius: 30,
        background: '#2C2C3A',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 1560px)": {
            backgroundImage: 'unset',
            height: 'auto'
        },
        "@media (max-width: 681px)": {
            // height: '641px'
        }
    },
    HistoryTable: {
        marginTop: '24px'
    },
    GameMainBox: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'flex-start',
        gap: 17,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        // "@media (max-width: 1560px)": {
        //     width: 'calc(100% - 20px)'
        // },
        "@media (max-width: 1560px)": {
            flexDirection: 'column-reverse',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'translate(0)',
            position: 'relative'
        },
    },
    GameControlPanel: {
        background: 'url("/assets/images/crash/panelbg.png")',
        maxWidth: 401,
        width: '100%',
        padding: '21px 14px 24px 11px',
        backgroundSize: '100% 100%',
        "@media (max-width: 1560px)": {
            maxWidth: 'unset',
            width: '100%'
        },
        "@media (max-width: 1210px)": {
            marginTop: '-185px'
        },
        "@media (max-width: 940px)": {
            marginTop: '0px'
        },
        "@media (max-width: 888px)": {
            marginTop: '-185px'
        },
        "@media (max-width: 685px)": {
            marginTop: '-36.45vw'
        }
    },
    BetTypeBox: {
        background: 'url("/assets/images/crash/selectbg.png")',
        width: '100%',
        height: 68,
        padding: '11px 38px 10px 23px',
        marginBottom: 11,
        gap: 9,
        display: 'flex',
        backgroundSize: '100% 100%',
    },
    BetTypeButton: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        fontWeight: 700,
        color: '#FFF',
        textTransform: 'uppercase',
        background: 'transparent'
    },
    SelectedBg: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)'
    },
    BetAmountBox: {
        marginBottom: 15,
    },
    CommonLabel: {
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        fontWeight: 400,
        textTransform: 'uppercase',
        marginBottom: 8
    },
    InputBackground: {
        background: 'url("/assets/images/crash/inputbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 55
    },
    BetButton: {
        background: 'url("/assets/images/crash/betbuttonbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 70,
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 21,
        lineHeight: '27px',
        color: '#FFF',
        textTransform: 'uppercase',
        display: 'flex',
        flexDirection: 'column'
    },
    WaitingText: {
        fontSize: 14,
        lineHeight: '14px'
    },
    InputBox: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 15,
        paddingTop: 2
    },
    CurrencyIcon: {
        width: 25,
        height: 25
    },
    BetAmountInput: {
        width: '100%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#FFFFFF',
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 14,
        lineHeight: '18px',
        paddingLeft: 8,
        height: '100%'
    },
    AmountActionBox: {
        display: 'flex',
        height: '100%'
    },
    AmountActionButton: {
        backgroundColor: '#4D3C6A',
        width: 55,
        minWidth: 55,
        borderRadius: 0,
        fontFamily: 'Styrene A Web',
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: 14,
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#FFF",
        height: '100%'
    },
    AmountMiddleButton: {
        backgroundColor: '#734FA1'
    },
    CustomSelect: {
        boxSizing: "border-box",
        width: "100%",
        height: 55,
        border: "none",
        borderRadius: 0,
        background: "transparent",
        color: '#FFF',
        "&>svg.MuiSvgIcon-root": {
            color: '#FFF'
        },
        "&>.MuiSelect-select": {
            background: 'transparent',
            color: '#FFF',
            fontSize: 14,
            fontWeight: 700,
            padding: '0px 10px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 5
        },
        "&>.Mui-disabled": {
            "-webkit-text-fill-color": 'unset',
            opacity: '0.6'
        }
    },
    CustomMenuItem: {
        color: '#FFF',
        display: 'flex',
        gap: 5,
        fontSize: 14,
        fontWeight: 700
    },
    GamePlayBox: {
        // background: 'url("/assets/images/crash/gamebg.png")',
        // width: '100%',
        // width: 'calc(100% - 401px - 17px)',
        flex: 'none',
        width: 1128,
        height: 771,
        backgroundSize: '100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        "@media (max-width: 1800px)": {
            width: 1008
        },
        "@media (max-width: 1680px)": {
            width: 888
        },
        "@media (max-width: 1560px)": {
            width: '100%',
        },
        "@media (max-width: 685px)": {
            height: '150vw'
        }
    },
    PixiRefBox: {
        width: '100%',
        height: '100%',
        "&>canvas": {
            width: '100%',
            height: '100%'
        }
    },
    BetListBox: {
        marginTop: 12
    },
    ListHeaderBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ListCountBox: {
        display: 'flex',
        gap: 7,
        alignItems: 'center',
        "&>span": {
            fontFamily: 'Styrene A Web',
            fontWeight: 700,
            fontSize: 14,
            color: '#FFF'
        }
    },
    TotalBalanceBox: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        "&>img": {
            width: 28,
            height: 28
        },
        "&>span": {
            fontFamily: 'Styrene A Web',
            fontWeight: 700,
            fontSize: 14,
            color: '#FFF'
        }
    },
    ListDataBox: {
        marginTop: 14,
        width: '100%',
        height: 242,
        background: '#414152',
        padding: '10px 17px'
    },
    SubDataBox: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        "&::-webkit-scrollbar": {
            width: 2
        },
        "&::-webkit-scrollbar-track": {
            background: '#1B1B1F'
        },
        "&::-webkit-scrollbar-thumb": {
            // background: 'linear-gradient(48.57deg, #5A45D1 24.42 %, #BA6AFF 88.19 %)',
            backgroundColor: '#BA6AFF',
            borderRadius: '100px',
            width: 6
        }
    },
    DataBox: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 14
    },
    UserNameBox: {
        width: '35%',
        color: 'rgba(255, 255, 255, 0.5)'
    },
    CashoutBox: {
        width: '25%',
        color: 'rgba(255, 255, 255)',
        textAlign: 'right'
    },
    ListBetAmountBox: {
        width: '40%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        "&>img": {
            width: 20,
            height: 20
        },
        "&>span": {
            color: '#FFF'
        }
    }
}));

export var gameApp = null;

const BET_TYPE = { manual: 0, auto: 1 };

const CrashGame = () => {
    const classes = useStyles();
    const { addToast } = useToasts();

    const pixiRef = useRef(null);

    const authData = useSelector((state) => state.authentication);
    const currency = authData.isAuth ? authData.userData.currency : '';
    const settingData = useSelector((state) => state.settingOption);

    const [soundEvent, setSoundEvent] = useState(null);
    const [playBgSound, bgSoundOption] = useSound(BgSound);
    const [playExplosionSound] = useSound(ExplosionSound);
    const [playFlyingSound] = useSound(FlyingSound);
    const [playClickSound] = useSound(ClickSound);

    const setting = { min: 1, max: 1000 };
    const [betType, setBetType] = useState(BET_TYPE.manual);
    const [betStatus, setBetStatus] = useState(BET_STATUS.BET);
    const [roundStatus, setRoundStatus] = useState(null);
    const [remainAutoRound, setRemainAutoRound] = useState(0);
    const [autoFinished, setAutoFinished] = useState(true);
    const playLoading = false;

    const [betAmount, setBetAmount] = useState(setting.min);
    const [cashoutAt, setCashoutAt] = useState(2);
    const [autoCount, setAutoCount] = useState(1);

    const [initDataResponse, setInitDataResponse] = useState(null);
    const [cashoutResponse, setCashoutResponse] = useState(null);
    const [cancelResponse, setCancelResponse] = useState(null);
    const [betResponse, setBetResponse] = useState(null);

    const [newBetUserResponse, setNewBetUserResponse] = useState(null);
    const [newCashoutResponse, setNewCashoutResponse] = useState(null);
    const [removeBetUserResponse, setRemoveBetUserResponse] = useState(null);

    const [betList, setBetList] = useState([]);
    const [totalBetAmount, setTotalBetAmount] = useState(0);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        window.addEventListener("resize", resizeHandler);
        CrashSocketManager.getInstance().connect();

        gameApp = new CrashApp({
            backgroundColor: 0x000000,
            backgroundAlpha: 0,
            antialiasing: true,
            autoDensity: true
        });
        pixiRef.current.appendChild(gameApp.view);
        gameApp.startGame();

        resizeHandler();

        return () => {
            window.removeEventListener('message', onWindowMessage);
            window.removeEventListener("resize", resizeHandler);
            CrashSocketManager.getInstance().disconnect();
            bgSoundOption.stop();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (authData.isAuth) {
            CrashSocketManager.getInstance().getInitData({ userId: authData.userData._id });
        }
        else {
            CrashSocketManager.getInstance().getInitData({ userId: '' });
        }
        // eslint-disable-next-line
    }, [authData.isAuth]);

    useEffect(() => {
        if (initDataResponse !== null) {
            if (initDataResponse.status) {
                let list = [...betList];
                // eslint-disable-next-line
                initDataResponse.data.betList.map((item) => {
                    const newUser = {
                        userId: item.userId,
                        userNickName: item.userNickName,
                        betAmount: item.betAmount,
                        coinType: item.coinType.coinType,
                        isCashout: item.isCashouted,
                        cashoutAt: item.payout,
                        profit: item.payout
                    };
                    list.push(newUser);
                });
                setBetList([...list]);

                if (gameApp !== null)
                    gameApp.initHistory(initDataResponse.data.history);
            }
        }
        // eslint-disable-next-line
    }, [initDataResponse]);

    useEffect(() => {
        if (betResponse !== null) {
            if (betResponse.status) {
                if (betResponse.data.joinType === 'direct') {
                    setBetStatus(BET_STATUS.DIRECT);
                }
                else if (betResponse.data.joinType === 'waiting') {
                    setBetStatus(BET_STATUS.WAITING);
                }
            }
            else {
                addToast(betResponse.message, { appearance: 'error', autoDismiss: true });
            }
        }
        // eslint-disable-next-line
    }, [betResponse]);

    useEffect(() => {
        if (cashoutResponse !== null) {
            if (cashoutResponse.status) {
                setBetStatus(BET_STATUS.BET);
                addToast(`You win ${cashoutResponse.data.profit.toFixed(2)}.`, { appearance: 'success', autoDismiss: true });
                if (remainAutoRound <= 0) {
                    setAutoFinished(true);
                }
            }
            else {
                addToast(cashoutResponse.message, { appearance: 'error', autoDismiss: true });
            }
        }
        // eslint-disable-next-line
    }, [cashoutResponse]);

    useEffect(() => {
        if (cancelResponse !== null) {
            if (cancelResponse.status) {
                setBetStatus(BET_STATUS.BET);
            }
            else {
                addToast(cancelResponse.message, { appearance: 'error', autoDismiss: true });
            }
        }
        // eslint-disable-next-line
    }, [cancelResponse]);

    useEffect(() => {
        if (newBetUserResponse !== null) {
            let list = [...betList];
            const newUser = {
                userId: newBetUserResponse.userId,
                userNickName: newBetUserResponse.userNickName,
                betAmount: newBetUserResponse.betAmount,
                coinType: newBetUserResponse.coinType.coinType,
                isCashout: newBetUserResponse.isCashouted,
                cashoutAt: newBetUserResponse.payout,
                profit: newBetUserResponse.payout
            };
            list.push(newUser);
            setBetList([...list]);
        }
        // eslint-disable-next-line
    }, [newBetUserResponse]);

    useEffect(() => {
        if (newCashoutResponse !== null) {
            let list = [...betList];
            let index = list.findIndex(item => item.userId === newCashoutResponse.userId);
            if (index >= 0) {
                list[index].isCashout = newCashoutResponse.isCashouted;
                list[index].cashoutAt = newCashoutResponse.payout;
                list[index].profit = newCashoutResponse.profit;
            }
            setBetList([...list]);

            if (gameApp !== null)
                gameApp.createCashout(newCashoutResponse);
        }
        // eslint-disable-next-line
    }, [newCashoutResponse]);

    useEffect(() => {
        if (removeBetUserResponse !== null) {
            let list = [...betList];
            list = list.filter((item) => item.userId !== removeBetUserResponse.userId);
            setBetList(list);
        }
        // eslint-disable-next-line
    }, [removeBetUserResponse]);

    useEffect(() => {
        if (roundStatus !== null) {
            if (roundStatus.status === GAME_STATE.COUNTDOWN) {
                if (gameApp !== null)
                    gameApp.countDown(roundStatus.count);
            }
            else if (roundStatus.status === GAME_STATE.WAITING) {
                if (betStatus === BET_STATUS.DIRECT) {
                    setBetStatus(BET_STATUS.CASHOUT);
                }

                if (gameApp !== null) {
                    gameApp.setNeedSound(true);
                    gameApp.countDown(0);
                }
            }
            else if (roundStatus.status === GAME_STATE.FLY) {
                if (gameApp !== null)
                    gameApp.fly(roundStatus.payout, roundStatus.time);
            }
            else if (roundStatus.status === GAME_STATE.CRASH) {
                if (betStatus !== BET_STATUS.WAITING) {
                    setBetStatus(BET_STATUS.BET);
                    setBetList([]);
                }

                if (gameApp !== null)
                    gameApp.crash(roundStatus.fairResult);
            }
            else if (roundStatus.status === GAME_STATE.COMPLETED) {
                if (gameApp !== null)
                    gameApp.complete();

                if (remainAutoRound > 0) {
                    if (remainAutoRound !== autoCount)
                        sendJoinBet();
                    setRemainAutoRound(remainAutoRound - 1);
                }
                else {
                    setAutoFinished(true);
                }
            }
        }
        // eslint-disable-next-line
    }, [roundStatus]);

    useEffect(() => {
        let amount = 0;
        // eslint-disable-next-line
        betList.map((item) => {
            if (item.coinType === currency.coinType) {
                amount += Number(item.betAmount);
            }
        });
        setTotalBetAmount(amount);
        // eslint-disable-next-line
    }, [betList, currency]);

    useEffect(() => {
        if (settingData.sound && settingData.backgroundSound) {
            playBgSound();
        }
        if (!settingData.sound || !settingData.backgroundSound) {
            bgSoundOption.stop();
        }
        return () => {
            bgSoundOption.stop();
        }
        // eslint-disable-next-line
    }, [settingData]);

    useEffect(() => {
        if (soundEvent !== null) {
            if (soundEvent?.data?.data === 'explosion')
                playEffectSound(playExplosionSound);
            if (soundEvent?.data?.data === 'flying')
                playEffectSound(playFlyingSound);
        }
        // eslint-disable-next-line
    }, [soundEvent]);

    const playEffectSound = (soundPlay) => {
        if (settingData.sound && settingData.effectSound) {
            soundPlay();
        }
    };

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-Crash-BetResult') {
            setBetResponse({ ...event.data.data });
        }
        if (event?.data?.type === 'playzelo-Crash-ReportStatus') {
            setRoundStatus({ ...event.data.data });
        }
        if (event?.data?.type === 'playzelo-Crash-CancelResult') {
            setCancelResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Crash-CashoutResult') {
            setCashoutResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Crash-NewBetUser') {
            setNewBetUserResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Crash-NewCashout') {
            setNewCashoutResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Crash-RemoveBetUser') {
            setRemoveBetUserResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Crash-GetInitDataResponse') {
            setInitDataResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Crash-Sound') {
            setSoundEvent(event);
        }
    };

    const resizeHandler = () => {
        if (!gameApp)
            return;

        const parent = document.getElementsByClassName(classes.GamePlayBox);
        gameApp.onResize(parent[0].clientWidth, parent[0].clientHeight);
    }

    const handleBet = () => {
        if (authData.isAuth) {
            playEffectSound(playClickSound);
            sendJoinBet();
        }
    };

    const handleCancel = () => {
        if (authData.isAuth) {
            sendCancelBet();
        }
    }

    const handleCashout = () => {
        if (authData.isAuth) {
            const request = {
                userId: authData.userData._id
            };
            CrashSocketManager.getInstance().cashoutBet(request);
        }
    }

    const handleAutoBet = () => {
        if (authData.isAuth) {
            playEffectSound(playClickSound);
            setAutoFinished(false);
            setRemainAutoRound(autoCount);
            sendJoinBet();
        }
    };

    const handleStopAutoBet = () => {
        if (authData.isAuth) {
            setAutoFinished(true);
            sendCancelBet();
            setRemainAutoRound(0);
        }
    };

    const handleAmountAction = (type) => {
        switch (type) {
            case 0:
                setBetAmount(betAmount / 2);
                break;
            case 1:
                setBetAmount(betAmount * 2);
                break;
            case 2:
                setBetAmount(setting.max);
                break;
            default:
                break;
        }
    };

    const sendJoinBet = () => {
        const request = {
            userId: authData.userData._id,
            betAmount: betAmount,
            coinType: currency,
            payout: cashoutAt
        };
        CrashSocketManager.getInstance().joinBet(request);
    };

    const sendCancelBet = () => {
        const request = {
            userId: authData.userData._id
        };
        CrashSocketManager.getInstance().cancelBet(request);
    };

    return (
        <Box className={classes.MainContainer}>
            <Box className={classes.GamePanel}>
                <SettingBox />
                <Box className={classes.GameMainBox}>
                    <Box className={classes.GameControlPanel}>
                        <Box className={classes.BetTypeBox}>
                            <Button
                                disabled={playLoading}
                                className={clsx(classes.BetTypeButton, betType === 0 ? classes.SelectedBg : '')}
                                onClick={() => setBetType(0)}
                            >
                                Manual
                            </Button>
                            <Button
                                disabled={playLoading}
                                className={clsx(classes.BetTypeButton, betType === 1 ? classes.SelectedBg : '')}
                                onClick={() => setBetType(1)}
                            >
                                Auto
                            </Button>
                        </Box>
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Bet Amount</Typography>
                            <Box className={classes.InputBackground}>
                                <Box className={classes.InputBox}>
                                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt={currency.coinType} />
                                    <input disabled={playLoading} type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className={classes.BetAmountInput} />
                                    <Box className={classes.AmountActionBox}>
                                        <Button disabled={playLoading} onClick={() => handleAmountAction(0)} className={classes.AmountActionButton}>1/2</Button>
                                        <Button disabled={playLoading} onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)}>2X</Button>
                                        <Button disabled={playLoading} onClick={() => handleAmountAction(2)} className={classes.AmountActionButton}>Max</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Cashout At</Typography>
                            <Box className={classes.InputBackground}>
                                <Box className={classes.InputBox}>
                                    <input disabled={playLoading} type="number" value={cashoutAt} onChange={(e) => setCashoutAt(e.target.value)} className={classes.BetAmountInput} />
                                </Box>
                            </Box>
                        </Box>
                        {
                            (betType === BET_TYPE.auto) &&
                            <Box className={classes.BetAmountBox}>
                                <Typography className={classes.CommonLabel}>Number of Bets</Typography>
                                <Box className={classes.InputBackground}>
                                    <input disabled={playLoading} type="number" value={autoCount} onChange={(e) => setAutoCount(e.target.value)} className={classes.BetAmountInput} />
                                </Box>
                            </Box>
                        }
                        {
                            (betType === BET_TYPE.manual && betStatus === BET_STATUS.BET) &&
                            <LoadingButton loading={playLoading} onClick={handleBet} className={classes.BetButton}>
                                Bet
                            </LoadingButton>
                        }
                        {
                            (betType === BET_TYPE.manual && (betStatus === BET_STATUS.WAITING || betStatus === BET_STATUS.DIRECT)) &&
                            <LoadingButton loading={playLoading} onClick={handleCancel} className={classes.BetButton}>
                                <span>Cancel</span>
                                {
                                    betStatus === BET_STATUS.WAITING && <span className={classes.WaitingText}>(Waiting for next round)</span>
                                }
                            </LoadingButton>
                        }
                        {
                            (betType === BET_TYPE.manual && (betStatus === BET_STATUS.CASHOUT)) &&
                            <LoadingButton loading={playLoading} onClick={handleCashout} className={classes.BetButton}>
                                Cashout
                            </LoadingButton>
                        }
                        {
                            (betType === BET_TYPE.auto && autoFinished) &&
                            <Button onClick={handleAutoBet} className={classes.BetButton}>
                                Start Auto Bet
                            </Button>
                        }
                        {
                            (betType === BET_TYPE.auto && (betStatus === BET_STATUS.CASHOUT)) &&
                            <LoadingButton loading={playLoading} onClick={handleCashout} className={classes.BetButton}>
                                Cashout
                            </LoadingButton>
                        }
                        {
                            (betType === BET_TYPE.auto && betStatus !== BET_STATUS.CASHOUT && !autoFinished) &&
                            <Button onClick={handleStopAutoBet} className={classes.BetButton}>
                                Stop Auto Bet
                            </Button>
                        }
                        <Box className={classes.BetListBox}>
                            <Box className={classes.ListHeaderBox}>
                                <Box className={classes.ListCountBox}>
                                    <UserListIcon />
                                    <span>{betList.length}</span>
                                </Box>
                                <Box className={classes.TotalBalanceBox}>
                                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt={currency.coinType} />
                                    <span>{totalBetAmount}</span>
                                </Box>
                            </Box>
                            <Box className={classes.ListDataBox}>
                                <Box className={classes.SubDataBox}>
                                    {
                                        betList.map((item, index) => (
                                            <Box className={classes.DataBox} key={index}>
                                                <Box className={classes.UserNameBox}>{item.userNickName}</Box>
                                                <Box className={classes.CashoutBox}>{item.isCashout ? item.cashoutAt.toFixed(2) : '-'}</Box>
                                                <Box className={classes.ListBetAmountBox}>
                                                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} alt={item.coinType} />
                                                    <span>{item.isCashout ? (item.profit).toFixed(4) : Number(item.betAmount).toFixed(4)}</span>
                                                </Box>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={classes.GamePlayBox}>
                        <Box className={classes.PixiRefBox} ref={pixiRef}>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.HistoryTable}>
                <HistoryBox />
            </Box>
        </Box>
    );
}

export default CrashGame;