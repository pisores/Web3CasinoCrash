import { Modal, Box, IconButton } from "@mui/material";
import { Close, KeyboardArrowRight } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import HomeIcon from "assets/icons/HomeIcon.png";
// import BonusIcon from "assets/icons/BonusIcon.png";
// import GamesIcon from "assets/icons/GamesIcon.png";
// import TournamentIcon from "assets/icons/TournamentsIcon.png";
// import AffiliateIcon from "assets/icons/AffiliateIcon.png";
// import TurtleRaceIcon from "assets/icons/TurtleRaceIcon.png";
// import SRPIcon from "assets/icons/ScissorIcon.png";
// import HelpIcon from "assets/icons/HelpIcon.png";
// import MinesIcon from "assets/icons/MinesIcon.png";
import ReportBugIcon from "assets/icons/ReportBugIcon.png";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { LoadingContext } from "layout/Context/loading";
import HomeIcon from "assets/icons/HomeIcon.png";
import BonusIcon from "assets/icons/BonusIcon.png";
import GamesIcon from "assets/icons/GamesIcon.png";
import TournamentIcon from "assets/icons/TournamentsIcon.png";
import AffiliateIcon from "assets/icons/AffiliateIcon.png";
import TurtleRaceIcon from "assets/icons/games/turtle.png";
import SRPIcon from "assets/icons/games/scissor.png";
import MinesIcon from "assets/icons/games/mines.png";
import DiceIcon from "assets/icons/games/dice.png";
import HelpIcon from "assets/icons/HelpIcon.png";
import { getAvailableGames } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '60px',
        width: '533px',
        height: 'calc(100% - 90px)',
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
            padding: '28px',
            borderRadius: '0px',
            display: 'block'
        }
    },
    ModalCloseButton: {
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
    ModalBodyBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '422px',
        flexDirection: 'column',
        "@media (max-width: 681px)": {
            width: '100%'
        }
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
    MenuBox: {
    },
    MenuOpen: {
        width: '100%',
        flex: 'none'
    },
    MenuClose: {
        width: '60px'
    },
    MenuItems: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '0px',
        margin: '0px'
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
        borderRadius: '8px'
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
    GamesLayout: {
        width: '100%'
    },
    GamesBox: {
        width: "100%",
        height: "60px",
        border: "1px solid #424253",
        borderRadius: "7px",
        marginBottom: '15px',
        marginTop: '15px',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10
    },
    GameBoxTitle: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: "19px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    GameItem: {
        width: '50px',
        height: '50px',
        // border: 'solid 1px #FEDA2F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        "& img": {
            width: '100%'
        }
    },
    GameMenu: {
        width: 'auto'
    }
}));

const MenuModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const menuOption = useSelector((state) => state.menuOption);
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
                    width: '22px',
                    height: '31px',
                    available: false
                },
                {
                    url: '/turtlerace',
                    text: 'Turtlerace',
                    icon: TurtleRaceIcon,
                    width: '32px',
                    height: '31px',
                    available: false
                },
                {
                    url: '/mines',
                    text: 'Mines',
                    icon: MinesIcon,
                    width: '28px',
                    height: '28px',
                    available: false
                },
                {
                    url: '/dice',
                    text: 'Dice',
                    icon: DiceIcon,
                    width: '28px',
                    height: '28px',
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
        if (path === '/') window.location.assign("/app/home");
        getGameListData();
        // eslint-disable-next-line
    }, []);

    const handleMenuRouter = (path) => {
        dispatch({ type: 'SET_MENUROUTER', data: path });
        handleClose();
    };

    const handleClose = () => setOpen(false);

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
        <Modal
            open={open}
            onClose={handleClose}
            slotProps={{ backdrop: { className: classes.backdrop } }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.ModalBox}>
                <IconButton className={classes.ModalCloseButton} onClick={handleClose}>
                    <Close />
                </IconButton>
                <Box className={classes.ModalBodyBox}>
                    <Box className={classes.GamesLayout}>
                        <span className={classes.GameBoxTitle}>Games</span>
                        <Box className={classes.GamesBox}>
                            {
                                menuItems[1].child.map((item, index) => (
                                    <Link
                                        key={index}
                                        className={clsx(classes.MenuItemLink, classes.GameMenu)}
                                        to={menuItems[1].url + item.url}
                                        onClick={() => handleMenuRouter(menuItems[1].url + item.url)}
                                    >
                                        <Box className={classes.GameItem}>
                                            <img src={item.icon} alt="icon" />
                                        </Box>
                                    </Link>
                                ))
                            }
                        </Box>
                    </Box>
                    <Box className={clsx(classes.MenuBox, classes.MenuOpen)}>
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
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

MenuModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default MenuModal;