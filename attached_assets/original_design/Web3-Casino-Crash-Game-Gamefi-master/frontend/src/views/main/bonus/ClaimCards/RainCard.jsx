import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardIcon from "assets/icons/rain.png";
import CardMoneyIcon from "assets/icons/CardMoney.png";
import CardLockIcon from "assets/icons/CardLock.png";
import MoneyIcon from "assets/icons/Crypto3.png";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    CardLayout: {
        width: '252px',
        height: '303px',
        background: '#2C2C3A',
        borderRadius: '8px',
        flex: 'none'
    },
    LockedCard: {
        opacity: '0.3'
    },
    CardTitleBox: {
        width: '100%',
        height: '58px',
        background: '#424253',
        borderRadius: '8px 8px 0px 0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '12px',
        gap: '12px'
    },
    CardTitle: {
        fontFamily: 'Styrene A Web',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '18px',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#FFF'
    },
    CardDetailBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '33px',
        marginTop: '12px'
    },
    ActionBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%'
    },
    AmountBox: {
        padding: '4px 10px 5px 6px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        background: "#424253",
        borderRadius: "7px",
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "23px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        }
    },
    ActionButton: {
        width: "100%",
        height: "51px",
        background: "#FED847",
        borderRadius: "8px",
        color: '#1F1E25',
        textTransform: 'uppercase',
        fontFamily: "'Styrene A Web'",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        maxWidth: '196px',
        "&.Mui-disabled": {
            background: "#424253",
            border: "1px solid #585867",
            color: '#FFF'
        }
    }
}));

const RainCard = ({ locked = false }) => {
    const classes = useStyles();

    return (
        <Box className={clsx(classes.CardLayout, locked ? classes.LockedCard : '')}>
            <Box className={classes.CardTitleBox}>
                <img src={CardIcon} alt="icon" width="50px" height="38px" />
                <span className={classes.CardTitle}>Rain</span>
            </Box>
            <Box className={classes.CardDetailBox}>
                {
                    locked ? <img src={CardLockIcon} alt="icon" width="78px" height="78px" />
                        : <img src={CardMoneyIcon} alt="icon" width="70px" height="70px" />
                }
                <Box className={classes.ActionBox}>
                    <Box className={classes.AmountBox}>
                        <img src={MoneyIcon} alt="icon" width="32px" height="33px" />
                        <span>0.03</span>
                    </Box>
                    <Button className={classes.ActionButton} disabled={locked}>Claim</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default RainCard;