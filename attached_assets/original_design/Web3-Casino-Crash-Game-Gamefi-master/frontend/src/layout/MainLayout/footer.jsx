import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FooterCoinItem from "./FooterCoinItem";
import { ReactComponent as TwitterIcon } from "assets/icons/TwitterIcon.svg";
import { ReactComponent as TelegramIcon } from "assets/icons/TelegramIcon.svg";
import { ReactComponent as FacebookIcon } from "assets/icons/FacebookIcon.svg";
import { ReactComponent as InstagramIcon } from "assets/icons/InstagramIcon.svg";

const useStyles = makeStyles(() => ({
    FooterBox: {
        width: '100%',
        background: '#282836',
        marginTop: '30px',
        padding: '37px 70px 13px 70px',
        "@media (max-width: 940px)": {
            padding: '20px'
        }
    },
    FooterCoinBox: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '44px',
        marginBottom: '33px',
        "@media (max-width: 681px)": {
            gap: '10px'
        }
    },
    DividLine: {
        width: '100%',
        height: '1px',
        background: '#FFF',
        opacity: '0.1',
        border: 'none'
    },
    GambleWareBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '22px',
        marginTop: '16px',
        marginBottom: '15px',
        "@media (max-width: 681px)": {
            flexWrap: 'wrap'
        }
    },
    CopyRightBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '25px',
        marginBottom: '20px'
    },
    CopyRightText: {
        fontWeight: '400',
        opacity: '0.4',
        color: '#FFF',
        fontSize: '13px',
        lineHeight: '16px'
    },
    ContactBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: '6px',
        alignItems: 'center'
    },
    GambleIcon: {
        width: '225px',
        height: '54px'
    },
    GameCareIcon: {
        width: '94px',
        height: '27px'
    }
}));

const FooterCoins = [
    { 'btc': 'BitCoin' },
    { 'btclightning': 'BitcoinLightning' },
    { 'eth': 'Ethereum' },
    { 'xrp': 'XRP' },
    { 'usdc': 'USDCoin' },
    { 'doge': 'Dogecoin' },
    { 'lite': 'Litecoin' },
    { 'dash': 'Dash' },
    { 'busd': 'BinanceUSD' },
    { 'dai': 'DAI' },
    { 'pancake': 'PancakeSwap' },
    { 'shiba': 'SHIBA' },
    { 'sushi': 'Sushi' },
    { 'uniswap': 'Uniswap' },
    { 'polygon': 'Polygon' },
    { 'usdt': 'Tether' }
];

const MainFooter = () => {
    const classes = useStyles();

    return (
        <Box className={classes.FooterBox}>
            <Box className={classes.FooterCoinBox}>
                {
                    FooterCoins.map((item, index) => {
                        return (
                            <FooterCoinItem key={index} coin={item} />
                        );
                    })
                }
            </Box>
            <Box className={classes.DividLine}></Box>
            <Box className={classes.GambleWareBox}>
                <img src="/assets/images/gambleaware.png" alt="icon" className={classes.GambleIcon} />
                <img src="/assets/images/gamecare.png" alt="icon" className={classes.GameCareIcon} />
            </Box>
            <Box className={classes.DividLine}></Box>
            <Box className={classes.CopyRightBox}>
                <img src={`/assets/images/Logo.png`} className={classes.LogoIcon} alt="Logo" />
                <span className={classes.CopyRightText}>copyright ©2023</span>
                <Box className={classes.ContactBox}>
                    <Link to="https://twitter.com/memewarsx" target="_blank"><TwitterIcon /></Link>
                    <Link to="https://t.me/MWXPORTAL" target="_blank"><TelegramIcon /></Link>
                </Box>
            </Box>
        </Box>
    );
};

export default MainFooter;