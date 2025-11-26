import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TournamentsIcon from "assets/icons/Tournaments.png";
import clsx from "clsx";
// import { useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
    CardLayout: {
        height: 368,
        backgroundColor: '#2C2C3A',
        backgroundImage: 'url("/assets/images/unlockerbg.png")',
        borderRadius: 30,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        padding: 25,
        "@media (max-width: 1100px)": {
            height: 250,
            borderRadius: 16
        }
    },
    CardTitleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16
    },
    CardTitleIcon: {
        width: 39,
        "@media (max-width: 1100px)": {
            width: 20
        }
    },
    CardTitleText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: '20px',
        textTransform: 'uppercase',
        color: '#FFF',
        "@media (max-width: 1100px)": {
            fontSize: 12,
            lineHeight: '16px'
        }
    },
    AmountBoxGroup: {
        margin: 'auto',
        background: '#424253',
        borderRadius: 7,
        padding: '9px 19px',
        marginTop: 34,
        width: 152,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        "@media (max-width: 1100px)": {
            width: 120,
            marginTop: 25
        }
    },
    AmountBox: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    CurrencyIcon: {
        width: 32,
        "@media (max-width: 1100px)": {
            width: 24
        }
    },
    LockedCurrencyIcon: {
        width: 20,
        "@media (max-width: 1100px)": {
            width: 16
        }
    },
    AmountText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 26,
        lineHeight: '33px',
        color: '#FFF',
        "@media (max-width: 1100px)": {
            fontSize: 18,
            lineHeight: '22px'
        }
    },
    LockedAmountText: {
        fontSize: 16,
        lineHeight: '20px',
        color: '#8F8E92',
        "@media (max-width: 1100px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    ClaimText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 16,
        color: '#FFF',
        marginTop: 46,
        marginBottom: 42,
        textAlign: 'center',
        width: '100%',
        "@media (max-width: 1100px)": {
            marginTop: 20,
            marginBottom: 20,
            fontSize: 12
        }
    },
    CommissionTextBox: {
        // width: '100%',
        maxWidth: 397,
        margin: 'auto'
    },
    CommissionText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: '20px',
        color: '#FFF',
        textAlign: 'center',
        "@media (max-width: 1100px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    }
}));

const BonusCard = () => {
    const classes = useStyles();

    // const authData = useSelector((state) => state.authentication);
    // const currency = authData.isAuth ? authData.userData.currency : 'zelo';
    const currency = { coinType: 'ZELO' };
    const claimAmount = 0;

    return (
        <Box className={classes.CardLayout}>
            <Box className={classes.CardTitleBox}>
                <img className={classes.CardTitleIcon} src={TournamentsIcon} alt="icon" />
                <span className={classes.CardTitleText}>New player bonus</span>
            </Box>
            <Box className={classes.AmountBoxGroup}>
                <Box className={classes.AmountBox}>
                    <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt={currency?.coinType} />
                    <span className={classes.AmountText}>{claimAmount.toFixed(2)}</span>
                </Box>
                <Box className={classes.AmountBox}>
                    <img className={clsx(classes.CurrencyIcon, classes.LockedCurrencyIcon)} src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt={currency.coinType} />
                    <span className={clsx(classes.AmountText, classes.LockedAmountText)}>{claimAmount.toFixed(2)}</span>
                </Box>
            </Box>
            <Typography className={classes.ClaimText}>Bonus from new player</Typography>
            <Box className={classes.CommissionTextBox}>
                <Typography className={classes.CommissionText}>You got 100$ from each new player you refer. These bonuses will unlock by their wagers.</Typography>
            </Box>
        </Box>
    );
};

export default BonusCard;