import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ScissorsSocketManager from "./utils/ScissorsSocketManager";
import HistoryBox from "./utils/HistoryBox";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { useToasts } from "react-toast-notifications";
import SettingBox from "views/components/setting";
import { LoadingButton } from "@mui/lab";

import ApngComponent from "react-apng";

import VSAnimation from "assets/images/VS.png";

import PaperAnimation from "assets/images/paper.png";
import RockAnimation from "assets/images/rock.png";
import ScissorAnimation from "assets/images/scissors.png";

import IdleAnimation from "assets/images/idle.png";
import DrawAnimation from "assets/images/draw.png";
import WinAnimation from "assets/images/win.png";
import LostAnimation from "assets/images/lost.png";

const ScissorData = ['rock', 'scissors', 'paper'];

const useStyles = makeStyles(() => ({
    MainContainer: {
        width: '100%',
        paddingLeft: '50px',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            paddingRight: '0px',
            paddingLeft: '0px',
        }
    },
    GamePanelBox: {
        width: '100%',
        height: '816px',
        borderRadius: '30px',
        backgroundImage: 'url("/assets/images/scissor/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        overflow: 'hidden',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
            height: 641
        }
    },
    HistoryTable: {
        marginTop: '24px'
    },
    FreeGuessingBox: {
        width: '371px',
        height: '65px',
        backgroundImage: 'url("/assets/images/scissor/FreeBg.png")',
        backgroundSize: '100% 100%',
        position: 'absolute',
        top: '8px',
        left: '50%',
        transform: 'translate(-50%)',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "27px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        "@media (max-width: 940px)": {
            width: 203,
            height: 36,
            fontSize: 12,
            lineHeight: '15px',
            left: 29,
            transform: 'unset',
        }
    },
    HistoryBox: {
        position: 'absolute',
        top: '85px',
        left: '50%',
        transform: 'translate(-50%)',
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        "&>img": {
            width: '61px'
        },
        "@media (max-width: 940px)": {
            top: 53,
            left: 30,
            transform: 'unset',
            gap: 7,
            "&>img": {
                width: 33
            }
        }
    },
    PlayerBox: {
        width: '231px',
        height: '76px',
        backgroundSize: '100% 100%',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "18px",
        lineHeight: "23px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '146px',
        "@media (max-width: 940px)": {
            width: 157,
            height: 52,
            fontSize: 12,
            lineHeight: '15px',
            top: 106
        }
    },
    LeftBox: {
        backgroundImage: 'url("/assets/images/scissor/MeBg.png")',
        left: '127px',
        "@media (max-width: 940px)": {
            left: 14
        }
    },
    RightBox: {
        backgroundImage: 'url("/assets/images/scissor/DlBg.png")',
        right: '117px',
        "@media (max-width: 940px)": {
            right: 14
        }
    },
    VSBox: {
        width: '702px',
        height: '565px',
        position: 'absolute',
        top: '50px',
        left: '50%',
        transform: 'translate(-50%)',
        "&>canvas": {
            width: '100%'
        },
        "@media (max-width: 940px)": {
            width: 351,
            height: 'unset',
            bottom: 223,
            top: 'unset'
        }
    },
    HandBox: {
        position: 'absolute',
        top: '115px',
        "&>canvas": {
            width: '620px'
        },
        "@media (max-width: 1440px)": {
            top: 150,
            "&>canvas": {
                width: '520px'
            }
        },
        "@media (max-width: 940px)": {
            top: 80,
            "&>canvas": {
                width: 300
            }
        }
    },
    LeftHand: {
        left: '0px',
        transformOrigin: 'left center'
    },
    RightHand: {
        right: '0px',
        transformOrigin: 'right center'
    },
    BetActionBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '19px',
        position: 'absolute',
        bottom: '21px',
        width: '100%',
        "@media (max-width: 940px)": {
            flexDirection: 'column',
            bottom: 10,
            gap: 5
        }
    },
    AmountInputBox: {
        backgroundImage: 'url("/assets/images/scissor/AmountBg.png")',
        backgroundSize: '100% 100%',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        "@media (max-width: 940px)": {
            width: '100%'
        }
    },
    AmountInput: {
        width: 'calc(100% - 221px)',
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "17px",
        lineHeight: "21px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        marginLeft: '5px'
    },
    CoinItem: {
        marginLeft: '16px',
        width: '35px',
        marginTop: '3px'
    },
    AmountActionBox: {
        display: 'flex',
        height: '90%'
    },
    AmountActionButton: {
        backgroundColor: '#4D3C6A',
        width: '55px',
        minWidth: '55px',
        borderRadius: '0px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        height: '100%'
    },
    AmountMiddleButton: {
        backgroundColor: '#734FA1'
    },
    BetTypeBox: {
        backgroundImage: 'url("/assets/images/scissor/SelectBg.png")',
        width: '278px',
        height: '55px',
        backgroundSize: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px',
        paddingLeft: '9px',
        "@media (max-width: 940px)": {
            height: 37,
            width: '100%',
            paddingRight: 20
        }
    },
    PlayButton: {
        backgroundImage: 'url("/assets/images/scissor/PlayBg.png")',
        width: '280px',
        height: '55px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        "@media (max-width: 940px)": {
            height: 37,
            width: '100%'
        }
    },
    SelectButton: {
        width: '40px',
        height: '40px',
        minWidth: '40px',
        borderRadius: '0px',
        "&>img": {
            width: '40px',
            height: '40px'
        },
        "@media (max-width: 940px)": {
            width: 30,
            height: 30,
            "&>img": {
                width: 30,
                height: 30
            }
        }
    },
    RandomButton: {
        width: '100px',
        height: '40px',
        backgroundColor: '#FED847',
        borderRadius: '5px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "12px",
        lineHeight: "15px",
        textTransform: "uppercase",
        color: "#1F1E25",
        "@media (max-width: 940px)": {
            marginLeft: 'auto'
        }
    },
    SelectedType: {
        border: 'solid 2px red'
    },
    ResultBox: {
        position: 'absolute',
        top: '140px',
        left: '50%',
        transform: 'translate(-50%)',
        "@media (max-width: 940px)": {
            "&>img": {
                width: 735
            }
        }
    },
    IdleAnimation: {
        position: 'absolute',
        bottom: '70px',
        left: 'calc((100% - 710px) / 2 + 24.5px)',
        "@media (max-width: 1440px)": {
            bottom: 98,
            width: 568,
            left: 'calc((100% - 568px) / 2 + 14.5px)'
        },
        "@media (max-width: 940px)": {
            bottom: 136,
            width: 355,
            left: 'calc((100% - 355px) / 2)'
        }
    },
    WinAnimation: {
        position: 'absolute',
        bottom: '0px',
        left: 'calc((100% - 1039px) / 2 - 106px)',
        "@media (max-width: 1440px)": {
            bottom: 41,
            width: 831,
            left: 'calc((100% - 931px) / 2 - 41px)'
        },
        "@media (max-width: 940px)": {
            bottom: 101,
            width: 519.5,
            left: 'calc((100% - 519.5px) / 2 - 65px)'
        }
    },
    LostAnimation: {
        position: 'absolute',
        bottom: '0px',
        left: 'calc((100% - 1016px) / 2 - 67.5px)',
        "@media (max-width: 1440px)": {
            bottom: 41,
            width: 813,
            left: 'calc((100% - 813px) / 2 - 57.5px)'
        },
        "@media (max-width: 940px)": {
            bottom: 101,
            width: 508,
            left: 'calc((100% - 508px) / 2 - 45.5px)'
        }
    },
    DrawAnimation: {
        position: 'absolute',
        bottom: '0px',
        left: 'calc((100% - 1016px) / 2 - 67.5px)',
        "@media (max-width: 1440px)": {
            bottom: 41,
            width: 813,
            left: 'calc((100% - 813px) / 2 - 57.5px)'
        },
        "@media (max-width: 940px)": {
            bottom: 101,
            width: 508,
            left: 'calc((100% - 508px) / 2 - 45.5px)'
        }
    }
}));

const ScissorWidget = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const setting = { max: 1000, min: 1 };
    const rate = 1.5;

    const authData = useSelector((state) => state.authentication);
    const currency = authData.isAuth ? authData.userData.currency : '';

    const [betHistory, setBetHistory] = useState([]);
    const [betAmount, setBetAmount] = useState(10);
    const [betType, setBetType] = useState(0);

    const [betResponse, setBetResponse] = useState(null);
    const [winImage, setWinImage] = useState('');

    const [showWinResult, setShowWinResult] = useState(false);
    const [playLoading, setPlayLoading] = useState(false);

    const winResultref = useRef();
    const lostResultref = useRef();
    const drawResultref = useRef();
    const vsRef = useRef();

    const leftIdleRef = useRef();
    const leftRockRef = useRef();
    const leftScissorRef = useRef();
    const leftPaperRef = useRef();

    const rightIdleRef = useRef();
    const rightRockRef = useRef();
    const rightScissorRef = useRef();
    const rightPaperRef = useRef();

    const [handAnimationData, setHandAnimationData] = useState({
        show: false,
        hand: {
            player: 0,
            dealer: 0
        }
    });
    const [vikingAnimationData, setVikingAnimationData] = useState({
        show: false,
        result: 0, //1: win, 2: lost, 3: draw,
    });
    const [vsAnimationData, setVsAnimationData] = useState(false);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        ScissorsSocketManager.getInstance().connect(authData);
        ScissorsSocketManager.getInstance().getHistoryData();

        return () => {
            window.removeEventListener('message', onWindowMessage);
            ScissorsSocketManager.getInstance().disconnect();
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (betResponse !== null) {
            if (!betResponse.result.status) {
                addToast(betResponse.result.message, { appearance: 'error', autoDismiss: true });
                return;
            }
            setVsAnimationData(true);
            setHandAnimationData({
                show: true,
                hand: {
                    player: betResponse.playerNumber,
                    dealer: betResponse.dealerNumber
                }
            });
            setVikingAnimationData({
                show: true,
                result: betResponse.winResult === 'win' ? 1 : betResponse.winResult === 'lost' ? 2 : 3
                // result: 3
            });

            setTimeout(() => {
                ScissorsSocketManager.getInstance().getHistoryData();
                setShowWinResult(true);
                setWinImage(betResponse.winResult);
            }, 5000);
        }
        // eslint-disable-next-line
    }, [betResponse]);

    useEffect(() => {
        if (showWinResult) {
            setTimeout(() => {
                setShowWinResult(false);
                setPlayLoading(false);
            }, 3200);
        }
        // eslint-disable-next-line
    }, [showWinResult]);

    useEffect(() => {
        if (betAmount > 1000) {
            setBetAmount(1000);
        }
        if (betAmount < 0.005) {
            setBetAmount(0.005);
        }
        // eslint-disable-next-line
    }, [betAmount]);

    useEffect(() => {
        if (handAnimationData.show) {
            if (handAnimationData.hand.player === 0) {
                leftRockRef.current.one();
                updateHandRef('left', 'RockRef');
            }
            else if (handAnimationData.hand.player === 1) {
                leftScissorRef.current.one();
                updateHandRef('left', 'ScissorRef');
            }
            else if (handAnimationData.hand.player === 2) {
                leftPaperRef.current.one();
                updateHandRef('left', 'PaperRef');
            }

            if (handAnimationData.hand.dealer === 0) {
                rightRockRef.current.one();
                updateHandRef('right', 'RockRef');
            }
            else if (handAnimationData.hand.dealer === 1) {
                rightScissorRef.current.one();
                updateHandRef('right', 'ScissorRef');
            }
            else if (handAnimationData.hand.dealer === 2) {
                rightPaperRef.current.one();
                updateHandRef('right', 'PaperRef');
            }

            setTimeout(() => {
                setHandAnimationData({
                    show: false,
                    hand: {
                        player: 0,
                        dealer: 0
                    }
                });
                updateHandRef('left', 'IdleRef');
                updateHandRef('right', 'IdleRef');
            }, 7000);
        }
        // eslint-disable-next-line
    }, [handAnimationData]);

    useEffect(() => {
        if (vikingAnimationData.show) {
            setTimeout(() => {
                setVikingAnimationData({
                    show: false,
                    result: 0
                });
                updateResultRef('idleResultRef');
            }, 7000);
        }

        if (vikingAnimationData.result === 1) {
            winResultref.current.one();
            updateResultRef('winResultRef');
        }
        else if (vikingAnimationData.result === 2) {
            lostResultref.current.one();
            updateResultRef('lostResultRef');
        }
        else if (vikingAnimationData.result === 3) {
            drawResultref.current.one();
            updateResultRef('drawResultRef');
        }
        // eslint-disable-next-line
    }, [vikingAnimationData]);

    useEffect(() => {
        updateVsRef(vsAnimationData);
        if (vsAnimationData) {
            vsRef.current.one();
            setTimeout(() => {
                setVsAnimationData(false)
            }, 3000)
        }
    }, [vsAnimationData]);

    const updateResultRef = (ref) => {
        let refList = ['winResultRef', 'lostResultRef', 'drawResultRef', 'idleResultRef'];
        // eslint-disable-next-line
        refList.map((item) => {
            if (item !== ref) {
                document.getElementById(item).style.opacity = 0;
            }
            else {
                document.getElementById(item).style.opacity = 1;
            }
        });
    };

    const updateVsRef = (flag) => {
        document.getElementById('vsRef').style.opacity = flag ? 1 : 0;
    };

    const updateHandRef = (direction, ref) => {
        let refList = ['RockRef', 'ScissorRef', 'PaperRef', 'IdleRef'];
        // eslint-disable-next-line
        refList.map((item) => {
            if (item !== ref) {
                document.getElementById(direction + item).style.opacity = 0;
            }
            else {
                document.getElementById(direction + item).style.opacity = 1;
            }
        });
    }

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-Scissors-BetResult') {
            setBetResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-Scissors-HistoryResult') {
            const response = event.data.data;
            let historyData = [];
            // eslint-disable-next-line
            response.history.map((history) => {
                historyData.push(history.betNumber);
            });
            setBetHistory([...historyData]);
        }
    };

    const handleAmountAction = (type) => {
        switch (type) {
            case 0:

                setBetAmount(Number((Math.round(betAmount / 2 * 1000) / 1000).toFixed(3)));
                break;
            case 1:
                setBetAmount(Number((Math.round(betAmount * 2 * 1000) / 1000).toFixed(3)));
                break;
            case 2:
                setBetAmount(setting.max);
                break;
            default:
                break;
        }
    };

    const handleBetAmount = (e) => {
        setBetAmount(Number((Math.round(e.target.value * 1000) / 1000).toFixed(3)));
    };

    const handleBet = () => {
        if (authData.isAuth) {
            const request = {
                playerNumber: betType,
                userId: authData.userData._id,
                betAmount: betAmount,
                coinType: currency
            };
            ScissorsSocketManager.getInstance().joinBet(request);
            setPlayLoading(true);
        }
    };

    const updateBetType = (type) => {
        setBetType(type);
    };

    return (
        <Box className={classes.MainContainer}>
            <Box className={classes.GamePanelBox}>
                <SettingBox />
                <Box className={classes.FreeGuessingBox}>
                    Freeguessing 0
                </Box>
                <Box className={classes.HistoryBox}>
                    {
                        betHistory.map((item, index) => (
                            <img src={`/assets/images/scissor/block_${ScissorData[item]}.png`} alt="icon" key={index} />
                        ))
                    }
                </Box>
                <Box className={clsx(classes.PlayerBox, classes.LeftBox)}>
                    Me
                </Box>
                <Box className={clsx(classes.PlayerBox, classes.RightBox)}>
                    Dealer
                </Box>

                <ApngComponent
                    rate={rate}
                    id="idleResultRef"
                    autoPlay={true}
                    src={IdleAnimation}
                    className={classes.IdleAnimation}
                />
                <ApngComponent
                    rate={rate}
                    id="winResultRef"
                    ref={winResultref}
                    src={WinAnimation}
                    className={classes.WinAnimation}
                    style={{ opacity: 0 }}
                />
                <ApngComponent
                    rate={rate}
                    id="lostResultRef"
                    ref={lostResultref}
                    src={LostAnimation}
                    className={classes.LostAnimation}
                    style={{ opacity: 0 }}
                />
                <ApngComponent
                    rate={rate}
                    id="drawResultRef"
                    ref={drawResultref}
                    src={DrawAnimation}
                    className={classes.DrawAnimation}
                    style={{ opacity: 0 }}
                />

                <Box className={classes.VSBox}>
                    <ApngComponent rate={rate} id="vsRef" ref={vsRef} autoPlay={false} src={VSAnimation} style={{ opacity: 0 }} />
                </Box>
                {
                    showWinResult &&
                    <Box className={classes.ResultBox}>
                        <img src={`/assets/images/scissor/${winImage}.png`} alt="result" />
                    </Box>
                }

                <Box className={clsx(classes.HandBox, classes.LeftHand)}>
                    <ApngComponent id="leftIdleRef" ref={leftIdleRef} src={RockAnimation} autoPlay={false} style={{ transform: 'rotateY(180deg)', opacity: 1 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.LeftHand)}>
                    <ApngComponent rate={rate} id="leftRockRef" ref={leftRockRef} src={RockAnimation} autoPlay={false} style={{ transform: 'rotateY(180deg)', opacity: 0 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.LeftHand)}>
                    <ApngComponent rate={rate} id="leftScissorRef" ref={leftScissorRef} src={ScissorAnimation} autoPlay={false} style={{ transform: 'rotateY(180deg)', opacity: 0 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.LeftHand)}>
                    <ApngComponent rate={rate} id="leftPaperRef" ref={leftPaperRef} src={PaperAnimation} autoPlay={false} style={{ transform: 'rotateY(180deg)', opacity: 0 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.RightHand)}>
                    <ApngComponent id="rightIdleRef" ref={rightIdleRef} src={RockAnimation} autoPlay={false} style={{ opacity: 1 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.RightHand)}>
                    <ApngComponent rate={rate} id="rightRockRef" ref={rightRockRef} src={RockAnimation} autoPlay={false} style={{ opacity: 0 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.RightHand)}>
                    <ApngComponent rate={rate} id="rightScissorRef" ref={rightScissorRef} src={ScissorAnimation} autoPlay={false} style={{ opacity: 0 }} />
                </Box>
                <Box className={clsx(classes.HandBox, classes.RightHand)}>
                    <ApngComponent rate={rate} id="rightPaperRef" ref={rightPaperRef} src={PaperAnimation} autoPlay={false} style={{ opacity: 0 }} />
                </Box>

                <Box className={classes.BetActionBox}>
                    <Box className={classes.AmountInputBox}>
                        <img src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt="zelo" className={classes.CoinItem} />
                        <input className={classes.AmountInput} type="number" value={betAmount} onChange={handleBetAmount} />
                        <Box className={classes.AmountActionBox}>
                            <Button onClick={() => handleAmountAction(0)} className={classes.AmountActionButton}>1/2</Button>
                            <Button onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)}>2X</Button>
                            <Button onClick={() => handleAmountAction(2)} className={classes.AmountActionButton}>Max</Button>
                        </Box>
                    </Box>
                    <Box className={classes.BetTypeBox}>
                        <Button onClick={() => updateBetType(0)} className={clsx(classes.SelectButton)}>
                            <img src="/assets/images/scissor/block_rock.png" alt="rock" className={betType === 0 ? classes.SelectedType : ''} />
                        </Button>
                        <Button onClick={() => updateBetType(1)} className={clsx(classes.SelectButton)}>
                            <img src="/assets/images/scissor/block_scissors.png" alt="scissor" className={betType === 1 ? classes.SelectedType : ''} />
                        </Button>
                        <Button onClick={() => updateBetType(2)} className={clsx(classes.SelectButton)}>
                            <img src="/assets/images/scissor/block_paper.png" alt="paper" className={betType === 2 ? classes.SelectedType : ''} />
                        </Button>
                        <Button onClick={() => updateBetType(3)} className={clsx(classes.RandomButton, betType === 3 ? classes.SelectedType : '')}>
                            Random
                        </Button>
                    </Box>
                    <LoadingButton className={classes.PlayButton} onClick={handleBet} loading={playLoading}>Play</LoadingButton>
                </Box>
            </Box>
            <Box className={classes.HistoryTable}>
                <HistoryBox />
            </Box>
        </Box >
    );
};

export default ScissorWidget;