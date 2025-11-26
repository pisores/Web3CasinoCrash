import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState, useEffect } from "react";
import FullTrendsBox from "./FullTrendsBox";
import TrendsBox from "./TrendsBox";

const useStyles = makeStyles(() => ({
    GamePanelContainer: {
        width: '367px',
        height: 'auto',
        gap: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flex: 'none',
        "@media (max-width: 1444px)": {
            display: 'none'
        }
    },
    StatisticsContainer: {
        display: 'flex',
        borderRadius: '4px',
        flexDirection: 'column',
        width: '100%',
        backgroundImage: 'url("/assets/images/turtle/Bet_History.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    },
    StatisticsBox: {
        width: '100%',
        padding: '29px 17px 6px 17px'
    },
    StatisticsBoxTitle: {
        display: 'flex',
        '-webkit-box-pack': 'justify',
        justifyContent: 'space-between',
        marginBottom: '10px'
    },
    StatisticsTitle: {
        color: '#f0ecff',
        fontSize: '16px',
        fontWeight: '700'
    },
    StatisticsDesc: {
        color: '#9893cb',
        fontSize: '14px'
    },
    HistoryCountBox: {
        width: '100%',
        height: '44px',
        marginBottom: '4px',
        background: '#311c6d',
        display: 'flex',
        '-webkit-box-pack': 'justify',
        borderRadius: '4px',
        justifyContent: 'space-between',
        color: '#FFF',
        alignItems: 'center',
        padding: '0px 20px 0px 12px'
    },
    HistoryTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px'
    },
    HistoryTitleSpan: {
        fontSize: '16px',
        fontWeight: '500',
        textTransform: 'uppercase'
    },
    HistoryCount: {
        fontWeight: '700',
        fontSize: '14px'
    },
    TrendsContainer: {
        marginTop: '19px',
        transition: 'height 700ms',
        overflow: 'hidden'
    },
    ActiveBetsBox: {
        borderRadius: '4px',
        width: '100%',
        height: '100%',
        flexGrow: '1',
        // background: '#1f0d53',
        backgroundImage: 'url("/assets/images/turtle/BetList_Bg.png")',
        backgroundSize: '100% 100%',
        overflow: 'hidden'
    },
    ArrowDonwButton: {
        background: '#311c6d',
        color: '#FFF',
        padding: '4px',
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        "&>svg": {
            height: '16px'
        }
    },
    ActiveBetsTitle: {
        padding: '16px 24px',
        display: 'flex',
        color: '#f8f5ff',
        justifyContent: 'space-between',
        fontSize: '16px',
        fontWeight: '500'
    },
    YellowCard: {
        backgroundImage: 'url("/assets/images/turtle/History_Yellow.png")',
        backgroundSize: '333px 44px',
        backgroundRepeat: 'no-repeat'
    },
    RedCard: {
        backgroundImage: 'url("/assets/images/turtle/History_Red.png")',
        backgroundSize: '333px 44px',
        backgroundRepeat: 'no-repeat'
    },
    BlueCard: {
        backgroundImage: 'url("/assets/images/turtle/History_Blue.png")',
        backgroundSize: '333px 44px',
        backgroundRepeat: 'no-repeat'
    },
    BetUsersBox: {
        overflow: 'auto',
        width: '100%',
        height: 'calc(100% - 51px)',
        "&>div:nth-child(2n+1)": {
            background: '#D9D9D910'
        },
        "&>div:nth-child(2n)": {
            background: 'transparent'
        }
    },
    BetUserItem: {
        width: '100%',
        height: '43px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 10px'
    },
    UserName: {
        color: '#FFF'
    },
    UserAmounBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        "&>img": {
            width: '20px'
        },
        "&>span": {
            color: '#FFF'
        }
    }
}));

const GamePanel = () => {
    const classes = useStyles();
    const [trendsOpen, setTrendsOpen] = useState(true);
    const [winnerCount, setWinnerCount] = useState([0, 0, 0]);

    const [betList, setBetList] = useState([]);
    const [newBetResponse, setNewBetResponse] = useState(null);
    const [removeBetResponse, setRemoveBetResponse] = useState(null);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        return () => {
            window.removeEventListener('message', onWindowMessage);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (newBetResponse !== null) {
            let newBet = {
                userNickName: newBetResponse.betUser.userNickName,
                coinType: newBetResponse.betUser.coinType,
                betAmount: newBetResponse.betUser.betAmount,
                userId: newBetResponse.betUser.userId
            };
            let betUsers = [...betList, newBet];
            setBetList(betUsers);
        }
        // eslint-disable-next-line
    }, [newBetResponse]);

    useEffect(() => {
        if (removeBetResponse !== null) {
            let betUsers = [...betList];
            let index = betUsers.findIndex((item) => { return item.userId === removeBetResponse.cancelUser.userId });
            if (index >= 0) betUsers.splice(index, 1);
            setBetList([...betUsers]);
        }
        // eslint-disable-next-line
    }, [removeBetResponse]);

    const CircleItem = ({ length, color }) => {
        return (
            <Box style={{ width: `${length}px`, height: `${length}px`, background: `${color}`, borderRadius: '50%' }}></Box>
        );
    };

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-currentRoundResult') {
            const historyData = event?.data?.data;
            let winnerData = [...winnerCount];
            // eslint-disable-next-line
            historyData.map((history) => {
                let winPos = history.winnerInfo.findIndex((item) => item === 0);
                winnerData[winPos] += 1;
            });
            setWinnerCount(winnerData);
            setBetList([]);
        }
        if (event?.data?.type === 'playzelo-turtle-newBetUser') {
            setNewBetResponse(event.data.data);
        }
        if (event?.data?.type === 'playzelo-turtle-removeBetUser') {
            setRemoveBetResponse(event.data.data);
        }
    };

    return (
        <Box className={classes.GamePanelContainer}>
            <Box className={classes.StatisticsContainer}>
                <Box className={classes.StatisticsBox}>
                    <Box className={clsx(classes.HistoryCountBox, classes.YellowCard)}>
                        <Box className={clsx(classes.HistoryTitle)}>
                            <CircleItem length={24} color={'#ff9314'} />
                            <span className={classes.HistoryTitleSpan}>Yellow</span>
                        </Box>
                        <span className={classes.HistoryCount}>{winnerCount[0]}</span>
                    </Box>
                    <Box className={clsx(classes.HistoryCountBox, classes.RedCard)}>
                        <Box className={classes.HistoryTitle}>
                            <CircleItem length={24} color={'#f23068'} />
                            <span className={classes.HistoryTitleSpan}>Red</span>
                        </Box>
                        <span className={classes.HistoryCount}>{winnerCount[1]}</span>
                    </Box>
                    <Box className={clsx(classes.HistoryCountBox, classes.BlueCard)}>
                        <Box className={classes.HistoryTitle}>
                            <CircleItem length={24} color={'#0d42ff'} />
                            <span className={classes.HistoryTitleSpan}>Blue</span>
                        </Box>
                        <span className={classes.HistoryCount}>{winnerCount[2]}</span>
                    </Box>
                    <Box className={classes.TrendsContainer}>
                        <TrendsBox />
                    </Box>
                    <Box className={classes.TrendsContainer} style={{ height: trendsOpen ? 179 : 0, marginTop: 19 }}>
                        <FullTrendsBox />
                    </Box>
                </Box>
                <Button className={classes.ArrowDonwButton} onClick={() => setTrendsOpen(!trendsOpen)}>
                    {
                        !trendsOpen ? <ExpandMore /> : <ExpandLess />
                    }
                </Button>
            </Box>
            <Box className={classes.ActiveBetsBox}>
                <Box className={classes.ActiveBetsTitle}>
                    <span>{betList.length} Bets</span>
                    <span>Total 0</span>
                </Box>
                <Box className={classes.BetUsersBox}>
                    {
                        betList.map((item, index) => (
                            <Box className={classes.BetUserItem} key={index}>
                                <span className={classes.UserName}>{item.userNickName}</span>
                                <Box className={classes.UserAmounBox}>
                                    <img src={`/assets/images/coins/${item.coinType.coinType.toLowerCase()}.png`} alt="coin icon" />
                                    <span>{item.betAmount}</span>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default GamePanel;
