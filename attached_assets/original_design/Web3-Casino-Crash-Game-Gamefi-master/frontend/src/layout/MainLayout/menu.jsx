import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useContext } from "react";
import HomeIcon from "assets/icons/HomeIcon.png";
import BonusIcon from "assets/icons/BonusIcon.png";
import GamesIcon from "assets/icons/GamesIcon.png";
import TournamentIcon from "assets/icons/TournamentsIcon.png";
import AffiliateIcon from "assets/icons/AffiliateIcon.png";
import TurtleRaceIcon from "assets/icons/games/turtle.png";
import SRPIcon from "assets/icons/games/scissor.png";
import MinesIcon from "assets/icons/games/mines.png";
import DiceIcon from "assets/icons/games/dice.png";
import PlinkoIcon from "assets/icons/games/plinko.png";
import SlotIcon from "assets/icons/games/slot.png";
import CrashIcon from "assets/icons/games/crash.png";
import BlackjackIcon from "assets/icons/games/blackjack.png";
import HelpIcon from "assets/icons/HelpIcon.png";
import ReportBugIcon from "assets/icons/ReportBugIcon.png";
import { KeyboardArrowRight } from "@mui/icons-material";
import { LoadingContext } from "layout/Context/loading";
import { getAvailableGames } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles(() => ({
    MenuBox: {
        padding: '10px 8px'
    },
    MenuOpen: {
        width: '269px',
        padding: '0px 50px 0px 50px',
        flex: 'none',
        position: 'relative',
        "@media (max-width: 940px)": {
            display: 'none'
        }
    },
    MenuClose: {
        width: '60px'
    },
    MenuItems: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '0px',
        margin: '0px',
        "&>li:last-child": {
            marginBottom: '0px'
        }
    },
    BonusBox: {
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        background: '#1a2c38',
        marginBottom: '8px',
        borderRadius: '5px',
        padding: '5px 5px'
    },
    MenuItem: {
        background: 'transparent',
        color: 'rgb(93, 175, 255)',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '43px',
        border: '1px solid #363646',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    MenuItemLink: {
        fontFamily: "'Cera Pro'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "15px",
        lineHeight: "19px",
        color: "#FFFFFF",
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        "&>span": {
            fontFamily: "'Cera Pro'",
            marginLeft: '5px',
            position: 'absolute',
            left: '48px'
        },
        "&>img": {
            position: 'absolute',
            left: '10px'
        },
        "&:hover": {
            opacity: '0.5'
        },
        "&>svg": {
            position: 'absolute',
            right: '10px',
            color: '#FFFAFA'
        }
    },
    ActiveMenu: {
    },
    RewardButton: {
        padding: '0px',
        color: '#FFF',
        textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: '14px',
        borderRadius: '6px',
        width: '100%',
        background: 'linear-gradient(51.22deg,rgba(255,87,26,.438688) -5.3%,rgba(255,87,26,.04) 40.46%),rgba(216,216,216,.05)',
        "&>img": {
            maxWidth: '40px'
        },
        "&.Mui-disabled": {
            color: '#FFF',
            opacity: '0.6'
        }
    },
    BugBox: {
        width: '100%',
        height: '76px',
        background: '#2C2C3A',
        border: '1px solid #6FE482',
        borderRadius: '7px',
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
        paddingLeft: '10px',
        "&>span": {
            color: '#FFF',
            fontWeight: '700',
            fontSize: '12px',
            lineHeight: '15px',
            width: '147px',
            "&>label": {
                color: '#6FE482'
            }
        },
        "&>div": {
            display: 'flex',
            alignItems: 'center',
            fontSize: '10px',
            lineHeight: '13px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: '700',
            justifyContent: 'flex-start',
            gap: '6px'
        }
    },
    PolicyBox: {
        width: '100%',
        marginTop: '34px'
    },
    PrivacyPolicyLink: {
        textDecoration: 'underline',
        color: '#68687D',
        fontSize: '15px',
        lineHeight: '188.2%',
        fontWeight: '400'
    },
    GamesSubMenu: {
        background: "rgba(44, 44, 58, 0.86)",
        backdropFilter: "blur(18px)",
        borderRadius: "8px",
        padding: '15px',
        position: 'absolute',
        width: '197px',
        top: '0px',
        left: '218px',
        zIndex: '10'
    },
    GameMenuItem: {
        border: 'none',
        "&>a": {
            "&>span": {
                marginLeft: 10,
            },
            "&>img": {
                left: 0
            }
        }
    }
}));

const MainMenu = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const menuOption = useSelector((state) => state.menuOption);
    const [gamesMenu, setGamesMenu] = useState(false);

    const gameMenuRef = useRef(null);
    const gameListRef = useRef(null);
    const listRef = useRef(null);

    const [menuItems, setMenuItems] = useState([
        {
            url: '/app/home',
            text: 'Home',
            icon: HomeIcon,
            width: '34px',
            height: '27px'
        },
        {
            url: '/app/games',
            text: 'Games',
            icon: GamesIcon,
            width: '34px',
            height: '25px',
            child: [
                {
                    url: '/scissor',
                    text: 'Scissor',
                    icon: SRPIcon,
                    available: false
                },
                {
                    url: '/turtlerace',
                    text: 'Turtlerace',
                    icon: TurtleRaceIcon,
                    available: false
                },
                {
                    url: '/mines',
                    text: 'Mines',
                    icon: MinesIcon,
                    available: false
                },
                {
                    url: '/dice',
                    text: 'Dice',
                    icon: DiceIcon,
                    available: false
                },
                {
                    url: '/plinko',
                    text: 'Plinko',
                    icon: PlinkoIcon,
                    available: false
                },
                {
                    url: '/slot',
                    text: 'Slot',
                    icon: SlotIcon,
                    available: false
                },
                {
                    url: '/crash',
                    text: 'Crash',
                    icon: CrashIcon,
                    available: false
                },
                {
                    url: '/blackjack',
                    text: 'Blackjack',
                    icon: BlackjackIcon,
                    available: false
                }
            ]
        },
        {
            url: '/app/bonues',
            text: 'Bonus',
            icon: BonusIcon,
            width: '25px',
            height: '23px'
        },
        {
            url: '/app/tournaments',
            text: 'Tournaments',
            icon: TournamentIcon,
            width: '28px',
            height: '25px'
        },
        {
            url: '/app/affiliate',
            text: 'Affiliate',
            icon: AffiliateIcon,
            width: '28px',
            height: '28px'
        },
        {
            url: '/app/help',
            text: 'Help Center',
            icon: HelpIcon,
            width: '35px',
            height: '35px'
        }
    ]);

    useEffect(() => {
        const path = window.location.pathname;
        dispatch({ type: 'SET_MENUROUTER', data: path });
        if (path === '/') window.location.assign("/app/games/scissor");
        getGameListData();

        window.addEventListener('mousemove', mouseMoveEvent);
        return () => {
            window.removeEventListener('mousemove', mouseMoveEvent);
        }
        // eslint-disable-next-line
    }, []);

    const handleMenuRouter = (path) => {
        setGamesMenu(false);
        dispatch({ type: 'SET_MENUROUTER', data: path });
    };

    const mouseMoveEvent = (e) => {
        if (gameMenuRef?.current?.contains(e.target) || gameListRef?.current?.contains(e.target)) {
            setGamesMenu(true);
        }
        else {
            setGamesMenu(false);
        }
    };

    const getGameListData = async () => {
        showLoading();
        const response = await getAvailableGames();
        if (response.status) {
            let menuData = [...menuItems];
            // eslint-disable-next-line
            menuData[1].child.map((child, index) => {
                let position = response.data.findIndex(item => item.gameName === child.text);
                if (position >= 0) {
                    menuData[1].child[index].available = true;
                }
            });
            setMenuItems([...menuData]);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box className={!menuOption.menuVisible ? clsx(classes.MenuBox, classes.MenuOpen) : clsx(classes.MenuBox, classes.MenuClose)}>
            <ul className={classes.MenuItems}>
                <div>
                    {
                        menuItems.map((item, index) => (
                            <li
                                key={index}
                                className={
                                    menuOption.menuRouter === item.url ? clsx(classes.MenuItem, classes.ActiveMenu)
                                        : classes.MenuItem
                                }
                                ref={item.child ? gameMenuRef : listRef}
                            >
                                <Link className={classes.MenuItemLink} to={item.url} onClick={() => handleMenuRouter(item.url)}>
                                    <img src={item.icon} alt="icon" width={item.width} height={item.height} />
                                    {
                                        !menuOption.menuVisible && <span>{item.text}</span>
                                    }
                                    {
                                        item.child &&
                                        <KeyboardArrowRight />
                                    }
                                </Link>
                                {
                                    (item.child && gamesMenu) &&
                                    <Box className={classes.GamesSubMenu} ref={gameListRef}>
                                        <ul className={classes.MenuItems}>
                                            {
                                                item.child.map((childItem, childIndex) =>
                                                    childItem.available ? (
                                                        <li
                                                            key={childIndex}
                                                            className={clsx(classes.MenuItem, classes.GameMenuItem, menuOption.menuRouter === item.url + childItem.url ? classes.ActiveMenu : classes.MenuItem)}
                                                        >
                                                            <Link
                                                                className={classes.MenuItemLink}
                                                                to={item.url + childItem.url}
                                                                onClick={() => handleMenuRouter(item.url + childItem.url)}
                                                            >
                                                                <img
                                                                    src={childItem.icon}
                                                                    alt="icon"
                                                                    width="47px"
                                                                    height="46px"
                                                                />
                                                                {
                                                                    !menuOption.menuVisible && <span>{childItem.text}</span>
                                                                }
                                                            </Link>
                                                        </li>
                                                    ) : null
                                                )
                                            }

                                        </ul>
                                    </Box>
                                }
                            </li>
                        ))
                    }
                </div>
            </ul>
            <Box className={classes.BugBox}>
                <Box>
                    <img src={ReportBugIcon} alt="icon" />
                    REPORT A BUG
                </Box>
                <span>Up to <label>$10,000</label> bounty program</span>
            </Box>
            <Box className={classes.PolicyBox}>
                <Link to="/home" className={classes.PrivacyPolicyLink}>Terms of Service Privacy Policy</Link>
            </Box>
        </Box>
    );
}

export default MainMenu;