import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HistoryBox from "./utils/HistoryBox";
import SettingBox from "views/components/setting";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import SlotSocketManager from "./utils/SlotSocketManager";
import { LoadingButton } from "@mui/lab";
import { SlotApp } from "./SlotApp";
import useSound from "use-sound";
import ReelSound from "assets/sounds/slot/reel.mp3";
import MatchSound from "assets/sounds/slot/match.mp3";
import WinSound from "assets/sounds/slot/win.mp3";
import ClickSound from "assets/sounds/slot/click.mp3";
import { useToasts } from "react-toast-notifications";

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
        backgroundImage: 'url("/assets/images/slot/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 1362px)": {
            // backgroundImage: 'unset',
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
        gap: 0,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1377,
        "@media (max-width: 1715px)": {
            width: 1177
        },
        "@media (max-width: 1507px)": {
            width: 1077,
        },
        "@media (max-width: 1362px)": {
            flexDirection: 'column-reverse',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'translate(0)',
            position: 'relative'
        }
    },
    GameControlPanel: {
        marginTop: 90,
        background: 'url("/assets/images/slot/panelbg.png")',
        width: 400,
        padding: '21px 14px 24px 11px',
        backgroundSize: '100% 100%',
        flex: 'none',
        "@media (max-width: 1715px)": {
            width: 300,
            marginTop: 80
        },
        "@media (max-width: 1507px)": {
            marginTop: 70
        },
        "@media (max-width: 1362px)": {
            width: '100%',
            background: '#1f1e25'
        },
        "@media (max-width: 940px)": {
            marginTop: 20
        }
    },
    BetTypeBox: {
        background: 'url("/assets/images/slot/selectbg.png")',
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
        background: 'url("/assets/images/slot/inputbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 55
    },
    BetButton: {
        background: 'url("/assets/images/slot/betbuttonbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 70,
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 21,
        lineHeight: '27px',
        color: '#FFF',
        textTransform: 'uppercase'
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
        width: 977,
        height: 726,
        backgroundSize: '100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        "@media (max-width: 1715px)": {
            width: 877,
            height: 651.7
        },
        "@media (max-width: 1507px)": {
            width: 777,
            height: 577.4
        },
        "@media (max-width: 1362px)": {
            width: 'calc(100vw - 323px)',
            height: 'calc((100vw - 323px) * 0.74)'
        },
        "@media (max-width: 940px)": {
            width: '100vw',
            height: '74vw',
            marginTop: 20
        }
    },
    PixiRefBox: {
        width: '100%',
        height: '100%',
        "&>canvas": {
            width: '100%',
            height: '100%'
        }
    }
}));

export var gameApp = null;

const BET_TYPE = { manual: 0, auto: 1 };
const TOTAL_LINES = 9;
var balanceData = null;

const SlotGame = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const pixiRef = useRef(null);
    const { addToast } = useToasts();

    const authData = useSelector((state) => state.authentication);
    const currency = authData.isAuth ? authData.userData.currency : '';
    const settingData = useSelector((state) => state.settingOption);

    const setting = { min: 1, max: 1000 };
    const [betType, setBetType] = useState(BET_TYPE.manual);
    const [remainAutoRound, setRemainAutoRound] = useState(0);
    const [playLoading, setPlayLoading] = useState(false);

    const [betAmount, setBetAmount] = useState(setting.min);
    const [linesCount, setLinesCount] = useState(TOTAL_LINES)
    const [autoCount, setAutoCount] = useState(1);
    const [betResponse, setBetResponse] = useState(null);

    const [soundEvent, setSoundEvent] = useState(null);
    const [playReelSound] = useSound(ReelSound);
    const [playMatchSound] = useSound(MatchSound);
    const [playWinSound] = useSound(WinSound);
    const [playClickSound] = useSound(ClickSound);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        window.addEventListener("resize", resizeHandler);
        SlotSocketManager.getInstance().connect();

        gameApp = new SlotApp({
            // resolution: devicePixelRatio,
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
            SlotSocketManager.getInstance().disconnect();
            window.removeEventListener("resize", resizeHandler);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (gameApp !== null) {
            gameApp.updateCurrency(currency);
        }
        // eslint-disable-next-line
    }, [currency]);

    useEffect(() => {
        if (betResponse !== null) {
            if (betResponse.status) {
                balanceData = betResponse.data.balance.data;
                if (gameApp !== null)
                    gameApp.showResult(betResponse.fairResult, betResponse.rewardData);
            }
            else {
                setPlayLoading(false);
                addToast(betResponse.message, { appearance: 'error', autoDismiss: true });
            }
        }
        // eslint-disable-next-line
    }, [betResponse]);

    useEffect(() => {
        if (gameApp !== null)
            gameApp.updateAuthData(authData);
        // eslint-disable-next-line
    }, [authData]);

    useEffect(() => {
        if (soundEvent !== null) {
            if (soundEvent?.data?.data === 'reel')
                playEffectSound(playReelSound);
            if (soundEvent?.data?.data === 'match')
                playEffectSound(playMatchSound);
            if (soundEvent?.data?.data === 'win')
                playEffectSound(playWinSound);
        }
        // eslint-disable-next-line
    }, [soundEvent]);

    const playEffectSound = (soundPlay) => {
        if (settingData.sound && settingData.effectSound) {
            soundPlay();
        }
    };

    const resizeHandler = () => {
        if (!gameApp)
            return;

        const parent = document.getElementsByClassName(classes.GamePlayBox);
        gameApp.onResize(parent[0].clientWidth, parent[0].clientHeight);
    }

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-Slot-BetResult') {
            setBetResponse({ ...event.data.data });
        }
        if (event?.data?.type === 'playzelo-Slot-UpdateLoading') {
            setPlayLoading(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Slot-UpdateGameState') {
            dispatch({ type: 'SET_BALANCEDATA', data: balanceData })
        }
        if (event?.data?.type === 'playzelo-Slot-Sound') {
            setSoundEvent(event);
        }
    };

    const handleBet = () => {
        if (gameApp !== null) {
            playEffectSound(playClickSound);
            gameApp.updateBetLines(linesCount);
            gameApp.updateBetAmount(betAmount);
            gameApp.updateAutoCount(0);
            gameApp.bet();
        }
    };

    const handleAutoBet = () => {
        if (gameApp !== null) {
            playEffectSound(playClickSound);
            gameApp.updateBetLines(linesCount);
            gameApp.updateBetAmount(betAmount);
            gameApp.updateAutoCount(autoCount - 1);
            gameApp.bet();
        }
    };

    const handleStopAutoBet = () => {
        setRemainAutoRound(0);
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

    const handleLineCount = (e) => {
        setLinesCount(e.target.value);
    }

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
                        {/* <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Risk</Typography>
                            <Box className={classes.InputBackground}>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="riskType"
                                        id="riskType"
                                        value={risk}
                                        onChange={handleRisk}
                                        className={classes.CustomSelect}
                                        disabled={!authData.isAuth || playLoading}
                                    >
                                        {
                                            Object.keys(RISKS).map((key, index) => (
                                                <MenuItem key={index} value={RISKS[key]} className={classes.CustomMenuItem}>
                                                    {key}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box> */}
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Rows</Typography>
                            <Box className={classes.InputBackground}>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="rowsCount"
                                        id="rowsCount"
                                        value={linesCount}
                                        onChange={handleLineCount}
                                        className={classes.CustomSelect}
                                        disabled={!authData.isAuth || playLoading}
                                    >
                                        {
                                            new Array(TOTAL_LINES).fill(0).map((value, index) => (
                                                <MenuItem key={index} value={index + 1} className={classes.CustomMenuItem}>
                                                    {index + 1}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
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
                            betType === BET_TYPE.manual &&
                            <LoadingButton loading={playLoading} onClick={handleBet} className={classes.BetButton}>
                                Bet
                            </LoadingButton>
                        }
                        {
                            (betType === BET_TYPE.auto && remainAutoRound <= 0) &&
                            <Button onClick={handleAutoBet} className={classes.BetButton}>
                                Start Auto Bet
                            </Button>
                        }
                        {
                            (betType === BET_TYPE.auto && remainAutoRound > 0) &&
                            <Button onClick={handleStopAutoBet} className={classes.BetButton}>
                                Stop Auto Bet
                            </Button>
                        }
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

export default SlotGame;