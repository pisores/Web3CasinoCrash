import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import DataTable from "views/components/datatable";
import { getBannerText } from "redux/actions/auth";
import BonusesCard from "./BonusCard";

const useStyles = makeStyles(() => ({
    RootContainer: {
        width: '100%',
        height: '100%'
    },
    CarouselBox: {
        width: '100%',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            padding: '0px 14px'
        }
    },
    BannerBox: {
        backgroundImage: 'url(/assets/images/banner-bg.png)',
        backgroundPosition: '26% 50%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: '#FFF',
        borderRadius: '30px',
        height: '362px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        "@media (max-width: 681px)": {
            height: '184px',
            borderRadius: '10px'
        }
    },
    BonusBannerBox: {
        backgroundImage: 'url(/assets/images/bonus-banner.png)',
        marginTop: '65px',
        height: '349px',
        "@media (max-width: 681px)": {
            height: '164px'
        }
    },
    BannerCharacter: {
        position: 'absolute',
        left: '680px',
        bottom: '-24px',
        width: '700px',
        height: '420px',
        "@media (max-width: 681px)": {
            left: 'unset',
            right: '-45px',
            bottom: '0px',
            width: '285px',
            height: 'auto'
        }
    },
    BonusBannerCharacter: {
        left: '757px',
        width: '752px',
        height: '452px',
        bottom: '-65px',
        "@media (max-width: 681px)": {
            width: '294px',
            left: 'unset',
            right: '0px',
            bottom: '0px',
            height: 'auto'
        }
    },
    BannerTextBox: {
        display: 'flex',
        flexDirection: 'column',
        width: '515px',
        position: 'absolute',
        left: '97px',
        top: '40px',
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            left: '50%',
            width: '100%',
            padding: '0px 20px',
            top: '10px'
        }
    },
    BannerTitle: {
        fontFamily: 'Styrene A Web',
        fontWeight: '900',
        fontSize: "49.391px",
        lineHeight: "63px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        textShadow: "-6.73513px 6.73513px 0px rgba(0, 0, 0, 0.25)",
        "&>span": {
            fontFamily: 'Styrene A Web',
            color: '#FED847'
        },
        "@media (max-width: 681px)": {
            fontSize: '18px',
            lineHeight: '23px'
        }
    },
    BannerDesc: {
        fontFamily: 'Styrene A Web',
        fontWeight: '900',
        fontSize: "73.28px",
        lineHeight: "94px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        textShadow: "-9.99288px 9.99288px 0px rgba(0, 0, 0, 0.25)",
        "@media (max-width: 681px)": {
            fontSize: '23px',
            lineHeight: '34px'
        }
    },
    BannerText: {
        fontFamily: 'Styrene A Web',
        fontWeight: '400',
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        "@media (max-width: 681px)": {
            display: 'none'
        }
    },
    BannerButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        cursor: 'pointer',
        gap: "10px",
        width: "171px",
        height: "51px",
        border: "1px solid #715AE0",
        borderRadius: "8px",
        textTransform: 'uppercase',
        fontFamily: 'Styrene A Web',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '18px',
        "&:hover": {
            opacity: '0.6'
        }
    },
    RegisterButton: {
        background: "#FED847",
        color: '#1F1E25'
    },
    DemoButton: {
        background: "#4D33AB",
        color: '#FFF',
        "@media (max-width: 681px)": {
            background: 'unset',
            border: 'none'
        }
    },
    BannerButtonBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        marginTop: "16px",
        "@media (max-width: 681px)": {
            flexDirection: 'column',
            alignItems: 'start',
            marginTop: '5px'
        }
    },
    GameListBox: {
        marginTop: '34px',
        width: '100%',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: "900",
            fontSize: "32px",
            lineHeight: "41px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            opacity: "0.5",
            textShadow: "-8.08791px 8.08791px 0px rgba(0, 0, 0, 0.25)",
            "@media (max-width: 681px)": {
                fontSize: '19px',
                lineHeight: '24px'
            }
        }
    },
    GameList: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '30px',
        marginTop: '22px',
        width: '100%',
        overflow: 'auto',
        flexWrap: 'wrap',
        "@media (max-width: 681px)": {
            gap: '20px',
            marginTop: '6px',
        },
        "@media (max-width: 1370px)": {
            justifyContent: 'space-evenly'
        }
    },
    GameListButton: {
        width: '241px',
        height: '242px',
        padding: '0px',
        borderRadius: '20px',
        flex: 'none',
        "&>img": {
            width: '100%',
            height: '100%'
        },
        "@media (max-width: 681px)": {
            width: '144px',
            height: '145px'
        }
    },
    BounsList: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '20px',
        marginTop: '55px',
        flexWrap: 'wrap',
        "@media (max-width: 1149px)": {
            gap: '40px'
        }
    },
    BonusBannerText: {
        width: '682px',
        top: '47px',
        "@media (max-width: 681px)": {
            top: '10px',
            width: '200px',
            padding: '0px 10px',
            left: '100px'
        }
    },
    HistoryBox: {
        width: '100%',
        marginTop: '65px'
    },
    HistoryStateBox: {
        border: '1px solid #363646',
        borderRadius: '8px',
        width: '509px',
        marginBottom: '20px',
        "@media (max-width: 830px)": {
            width: '100%',
        },
        "@media (max-width: 681px)": {
            borderRadius: '0px'
        }
    },
    HistoryTabButton: {
        width: '169px',
        height: '47px',
        borderRadius: '8px',
        color: '#FFF',
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: '700',
        lineHeight: '18px',
        fontFamily: 'Styrene A Web',
        padding: '0px',
        "@media (max-width: 830px)": {
            width: '33%',
        },
        "@media (max-width: 681px)": {
            borderRadius: '0px'
        }
    },
    SelectedButton: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)'
    }
}));

const GameBannerItems = [
    { name: 'scissor', link: '/app/games/scissor' },
    { name: 'loadcell', link: '/app/home' },
    { name: 'turtle', link: '/app/games/turtlerace' },
    { name: 'mines', link: '/app/games/mines' },
    { name: 'slot', link: '/app/games/slot' },
    { name: 'plinko', link: '/app/games/plinko' },
    { name: 'dice', link: '/app/games/dice' },
    { name: 'baccarat', link: '/app/home' },
    { name: 'crash', link: '/app/games/crash' },
    { name: 'roulette', link: '/app/home' },
    { name: 'blackjack', link: '/app/games/blackjack' },
    { name: 'digital-dice', link: '/app/home' },
    { name: 'slot2', link: '/app/home' },
];

const Home = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [historyState, setHistoryState] = useState(0);
    const [topBannerData, setTopBannerData] = useState({ text1: '', text2: '', text3: '' });
    const [bottomBannerData, setBottomBannerData] = useState({ text1: '', text2: '', text3: '' });

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await getBannerText();
        if (response.status) {
            let topData = response.data.find(item => item.type === 'top');
            setTopBannerData({ ...topData });
            let bottomData = response.data.find(item => item.type === 'bottom');
            setBottomBannerData({ ...bottomData });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box className={classes.RootContainer}>
            <Box className={classes.CarouselBox}>
                <Box className={classes.BannerBox}>
                    <img className={classes.BannerCharacter} src="/assets/images/BannerCharacter.png" alt="banner-character" />
                    <Box className={classes.BannerTextBox}>
                        <Box className={classes.BannerTitle}>{topBannerData.text1}</Box>
                        <Box className={classes.BannerDesc}>{topBannerData.text2}</Box>
                        <span className={classes.BannerText}>{topBannerData.text3}</span>
                        <Box className={classes.BannerButtonBox}>
                            <Box className={clsx(classes.BannerButton, classes.RegisterButton)}>Register Now</Box>
                            <Box className={clsx(classes.BannerButton, classes.DemoButton)}>Demo Game</Box>
                        </Box>
                    </Box>
                </Box>
                <Box className={clsx(classes.GameListBox)}>
                    <span>Our Games</span>
                    <Box className={clsx(classes.GameList, 'NoScroll')}>
                        {
                            GameBannerItems.map((item, index) => (
                                <Link to={item.link} key={index}>
                                    <Button className={classes.GameListButton}>
                                        <img src={`/assets/images/games/${item.name}.png`} alt="icon" />
                                    </Button>
                                </Link>
                            ))
                        }
                    </Box>
                </Box>
                <Box className={classes.GameListBox}>
                    <span>Bonuses</span>
                    <Box className={classes.BounsList}>
                        <BonusesCard
                            title={'Free Spins'}
                            text={'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.'}
                            icon="BonusFreeSpinIcon"
                            colored={false}
                        />
                        <BonusesCard
                            title={'Tournaments'}
                            text={'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.'}
                            icon="BonusTournamentsIcon"
                            colored={true}
                        />
                        <BonusesCard
                            title={'And more coming soon!'}
                            text={'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.'}
                            icon="BonusComingSoonIcon"
                            colored={false}
                        />
                    </Box>
                </Box>
                <Box className={classes.HistoryBox}>
                    <Box className={classes.HistoryStateBox}>
                        <Button onClick={() => setHistoryState(0)} className={clsx(classes.HistoryTabButton, historyState === 0 ? classes.SelectedButton : '')}>Recent</Button>
                        <Button onClick={() => setHistoryState(1)} className={clsx(classes.HistoryTabButton, historyState === 1 ? classes.SelectedButton : '')}>Lucky Wins</Button>
                        <Button onClick={() => setHistoryState(2)} className={clsx(classes.HistoryTabButton, historyState === 2 ? classes.SelectedButton : '')}>High Rollers</Button>
                    </Box>
                    <DataTable historyState={historyState} />
                </Box>
                <Box className={clsx(classes.BannerBox, classes.BonusBannerBox)}>
                    <img className={clsx(classes.BannerCharacter, classes.BonusBannerCharacter)} src="/assets/images/BonusBannerCharacter.png" alt="banner-character" />
                    <Box className={clsx(classes.BannerTextBox, classes.BonusBannerText)}>
                        <Box className={classes.BannerTitle}>{bottomBannerData.text1}</Box>
                        <Box className={classes.BannerTitle}>{bottomBannerData.text2}</Box>
                        <span className={classes.BannerText} style={{ marginTop: '20px' }}>{bottomBannerData.text3}</span>
                        <Box className={classes.BannerButtonBox}>
                            <Box className={clsx(classes.BannerButton, classes.RegisterButton)}>About Bonuses</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Home; 