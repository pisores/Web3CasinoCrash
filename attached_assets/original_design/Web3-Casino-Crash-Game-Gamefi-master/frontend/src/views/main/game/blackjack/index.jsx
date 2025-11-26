import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HistoryBox from "./utils/HistoryBox";
import SettingBox from "views/components/setting";
import { useSelector } from "react-redux";
// import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import clsx from "clsx";
// import { LoadingContext } from "layout/Context/loading";
import CardBox from "./utils/Card";
import { BLACKJACK_CARD_TYPE, BLACKJACK_CARD_NUMBER } from "config/constant";

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
        backgroundImage: 'url("/assets/images/blackjack/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 1362px)": {
            backgroundImage: 'unset',
            height: 'auto'
        }
    },
    HistoryTable: {
        marginTop: '24px'
    },
    GameMainBox: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'flex-start',
        gap: 22,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 113px)',
        "@media (max-width: 1560px)": {
            width: 'calc(100% - 20px)'
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
        background: 'url("/assets/images/blackjack/panelbg.png")',
        width: 401,
        padding: '21px 14px 24px 11px',
        backgroundSize: '100% 100%',
        flex: 'none',
        "@media (max-width: 1560px)": {
            width: 300
        },
        "@media (max-width: 1362px)": {
            width: '100%',
            background: 'unset'
        },
    },
    BetAmountBox: {
        marginBottom: 15,
    },
    InputBackground: {
        background: 'url("/assets/images/blackjack/inputbg.png")',
        backgroundSize: '100% 100%',
        width: '100%',
        height: 55
    },
    BetButton: {
        background: 'url("/assets/images/blackjack/betbuttonbg.png")',
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
    CommonLabel: {
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        fontWeight: 400,
        textTransform: 'uppercase',
        marginBottom: 8
    },
    GamePlayBox: {
        background: 'url("/assets/images/blackjack/gamebg.png")',
        width: '100%',
        height: 700,
        backgroundSize: '100% 100%',
        position: 'relative',
        overflow: 'hidden',
        "@media (max-width: 685px)": {
            height: 'auto'
        }
    },
    PlayActionBox: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 8px',
        marginBottom: 15
    },
    PlayActionButton: {
        width: 'calc(50% - 4px)',
        color: '#FFF',
        height: 51,
        display: 'flex',
        gap: 9,
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        backgroundSize: '100% 100%'
    },
    LeftButton: {
        backgroundImage: 'url("/assets/images/blackjack/actionbg1.png")'
    },
    RightButton: {
        backgroundImage: 'url("/assets/images/blackjack/actionbg2.png")'
    },
    StaticCardBox: {
        position: 'absolute',
        right: 20,
        top: -80
    },
    HandBox: {
        width: '100%',
        height: '100%',
        padding: '40px 20px',
        position: 'relative',
        display: 'grid',
        flexGrow: 1,
        gridTemplateRows: 'repeat(2, max-content)',
        alignContent: 'space-between'
    },
    HandSubBox: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center'
    }
}));

const BlackjackGame = () => {
    const classes = useStyles();
    // const { addToast } = useToasts();
    // const { showLoading, hideLoading } = useContext(LoadingContext);

    const authData = useSelector((state) => state.authentication);
    const currency = authData.isAuth ? authData.userData.currency : '';

    const setting = { min: 1, max: 1000 };
    const [betAmount, setBetAmount] = useState(setting.min);

    const cardData = {
        dealer: [
            { open: true, type: BLACKJACK_CARD_TYPE.HEARTS, number: BLACKJACK_CARD_NUMBER.NUMBER_2 },
            { open: true, type: BLACKJACK_CARD_TYPE.SPADES, number: BLACKJACK_CARD_NUMBER.NUMBER_10 },
            { open: true, type: BLACKJACK_CARD_TYPE.SPADES, number: BLACKJACK_CARD_NUMBER.NUMBER_A }
        ],
        player: [
            { open: true, type: BLACKJACK_CARD_TYPE.CLUBS, number: BLACKJACK_CARD_NUMBER.NUMBER_J },
            { open: true, type: BLACKJACK_CARD_TYPE.CLUBS, number: BLACKJACK_CARD_NUMBER.NUMBER_3 },
            { open: true, type: BLACKJACK_CARD_TYPE.DIAMONDS, number: BLACKJACK_CARD_NUMBER.NUMBER_5 }
        ]
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

    const handleBet = () => {
    };

    return (
        <Box className={classes.MainContainer}>
            <Box className={classes.GamePanel}>
                <SettingBox />
                <Box className={classes.GameMainBox}>
                    <Box className={classes.GameControlPanel}>
                        <Box className={classes.BetAmountBox}>
                            <Typography className={classes.CommonLabel}>Bet Amount</Typography>
                            <Box className={classes.InputBackground}>
                                <Box className={classes.InputBox}>
                                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt={currency.coinType} />
                                    <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className={classes.BetAmountInput} />
                                    <Box className={classes.AmountActionBox}>
                                        <Button onClick={() => handleAmountAction(0)} className={classes.AmountActionButton}>1/2</Button>
                                        <Button onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)}>2X</Button>
                                        <Button onClick={() => handleAmountAction(2)} className={classes.AmountActionButton}>Max</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.PlayActionBox}>
                            <Button className={clsx(classes.PlayActionButton, classes.LeftButton)}>
                                <span>Hit</span>
                                <img src={`/assets/images/blackjack/hit.png`} alt="hit" />
                            </Button>
                            <Button className={clsx(classes.PlayActionButton, classes.RightButton)}>
                                <span>Stand</span>
                                <img src={`/assets/images/blackjack/stand.png`} alt="stand" />
                            </Button>
                            <Button className={clsx(classes.PlayActionButton, classes.LeftButton)}>
                                <span>Split</span>
                                <img src={`/assets/images/blackjack/split.png`} alt="split" />
                            </Button>
                            <Button className={clsx(classes.PlayActionButton, classes.RightButton)}>
                                <span>Double</span>
                                <img src={`/assets/images/blackjack/double.png`} alt="double" />
                            </Button>
                        </Box>
                        <Button onClick={handleBet} className={classes.BetButton}>
                            Bet
                        </Button>
                    </Box>
                    <Box className={classes.GamePlayBox}>
                        <Box className={classes.StaticCardBox}>
                            <CardBox open={false} />
                        </Box>
                        <Box className={classes.HandBox}>
                            <Box className={classes.HandSubBox}>
                                {
                                    cardData.dealer.map((item, index) => (
                                        <CardBox {...item} key={index} />
                                    ))
                                }
                            </Box>
                            <Box className={classes.HandSubBox}>
                                {
                                    cardData.player.map((item, index) => (
                                        <CardBox {...item} key={index} />
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.HistoryTable}>
                <HistoryBox />
            </Box>
        </Box>
    );
};

export default BlackjackGame;