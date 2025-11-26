import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HeaderIcon from "assets/icons/Tournaments.png";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { useToasts } from "react-toast-notifications";
import { getAvailableGames } from "redux/actions/auth";
import LargeGameCard from "./cards/LargerCard";
import NormalGameCard from "./cards/NormalCard";

const useStyles = makeStyles(() => ({
    GameLayout: {
        width: '100%',
        height: 'auto'
    },
    HeaderBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '27px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontWeight: 900,
            fontSize: "26px",
            lineHeight: "36px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            opacity: 0.5,
            textShadow: "-8.08791px 8.08791px 0px rgba(0, 0, 0, 0.25)",
            textAlign: 'center'
        },
        "@media (max-width: 681px)": {
            flexDirection: 'column'
        }
    },
    HeaderIconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#424253',
        "&>img": {
            width: '41px',
            height: '35px'
        }
    },
    GamesList: {
        display: 'flex',
        gap: '40px',
        width: '100%',
        padding: '16px',
        flexWrap: 'wrap'
    },
    GameItem: {
        flexBasis: 'calc(20% - 40px)',
        "@media (max-width: 1670px)": {
            flexBasis: 'calc(25% - 40px)'
        },
        "@media (max-width: 1300px)": {
            flexBasis: 'calc(50% - 20px)'
        },
        "@media (max-width: 705px)": {
            flexBasis: 'calc(100%)'
        }
    },
    LargeGameItem: {
        flexBasis: 'calc(40% - 40px)',
        "@media (max-width: 1670px)": {
            flexBasis: 'calc(50% - 40px)'
        },
        "@media (max-width: 1300px)": {
            flexBasis: 'calc(100%)'
        },
        "@media (max-width: 705px)": {
            flexBasis: 'calc(100%)'
        }
    }
}));

const GamesLayout = () => {
    const classes = useStyles();

    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [gameList, setGameList] = useState([
        {
            gameName: 'Scissor',
            gameTitle: 'scissor',
            cardType: 1,
            link: '/app/games/scissor',
            available: false
        },
        {
            gameName: 'Dice',
            gameTitle: 'dice',
            cardType: 1,
            link: '/app/games/dice',
            available: false
        },
        {
            gameName: 'Turtlerace',
            gameTitle: 'turtle',
            cardType: 1,
            link: '/app/games/turtlerace',
            available: false
        },
        {
            gameName: 'Mines',
            gameTitle: 'mines',
            cardType: 1,
            link: '/app/games/mines',
            available: false
        },
        {
            gameName: 'Slot',
            gameTitle: 'slot',
            cardType: 1,
            link: '/app/games/slot',
            available: false
        },
        {
            gameName: 'Plinko',
            gameTitle: 'plinko',
            cardType: 1,
            link: '/app/games/plinko',
            available: false
        },
        {
            gameName: 'Crash',
            gameTitle: 'crash',
            cardType: 1,
            link: '/app/games/crash',
            available: false
        },
        {
            gameName: 'Blackjack',
            gameTitle: 'blackjack',
            cardType: 1,
            link: '/app/games/blackjack',
            available: false
        }
    ]);

    useEffect(() => {
        getGameListData();
        // eslint-disable-next-line
    }, [])

    const getGameListData = async () => {
        showLoading();
        const response = await getAvailableGames();
        if (response.status) {
            let gameData = [...gameList];
            // eslint-disable-next-line
            gameData.map((item, index) => {
                let position = response.data.findIndex(data => data.gameName === item.gameName);
                if (position >= 0) gameData[index].available = true;
            });
            setGameList([...gameData]);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box className={classes.GameLayout}>
            <Box className={classes.HeaderBox}>
                <Box className={classes.HeaderIconBox}>
                    <img src={HeaderIcon} alt={'icon'} />
                </Box>
                <span>Provably fair games</span>
            </Box>
            <Box className={classes.GamesList}>
                {
                    gameList.map((item, index) => item.available ? (
                        <Box key={index} className={clsx(item.cardType === 0 ? classes.LargeGameItem : '', classes.GameItem)}>
                            {
                                item.cardType === 0 ? <LargeGameCard {...item} />
                                    : <NormalGameCard {...item} />
                            }
                        </Box>
                    ) : null)
                }
            </Box>
        </Box>
    );
};

export default GamesLayout;