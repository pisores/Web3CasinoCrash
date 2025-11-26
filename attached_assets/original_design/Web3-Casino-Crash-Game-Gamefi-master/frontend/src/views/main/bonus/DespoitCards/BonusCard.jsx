import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({
    CardBox: {
        width: "calc(25% - 15px)",
        height: "392px",
        background: "#2C2C3A",
        borderRadius: "8px",
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        "@media (max-width: 1500px)": {
            width: "calc(50% - 20px)"
        },
        "@media (max-width: 915px)": {
            width: "100%"
        },
        "@media (max-width: 681px)": {
            height: 240,
            gap: 12,
            borderRadius: 4
        }
    },
    DeactiveCard: {
        opacity: '0.3'
    },
    CardTitle: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "28px",
        lineHeight: "36px",
        textAlign: "right",
        textTransform: "uppercase",
        color: '#FFF',
        "&>span": {
            color: '#6FE482'
        },
        "@media (max-width: 681px)": {
            fontSize: 16,
            lineHeight: '18px'
        }
    },
    UptoBox: {
        width: "74px",
        height: "31px",
        background: "#424253",
        border: "1px solid #2C2C3A",
        borderRadius: "7px",
        color: '#6FE482',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "13px",
        lineHeight: "17px",
        textTransform: "uppercase",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        "@media (max-width: 681px)": {
            fontSize: 11,
            lineHeight: '12px',
            width: 50,
            height: 24
        }
    },
    PercentBox: {
        background: "#424253",
        border: "1px solid #424253",
        borderRadius: "7px",
        width: "152px",
        height: "69px",
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "32px",
        lineHeight: "40px",
        textTransform: "uppercase",
        color: "#6FE482",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        "@media (max-width: 681px)": {
            fontSize: 20,
            lineHeight: '24px',
            height: 30,
            width: 100
        }
    },
    DepositButton: {
        width: "80%",
        height: "51px",
        background: "#FED847",
        borderRadius: "8px",
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#1F1E25",
        "@media (max-width: 681px)": {
            fontSize: 12,
            lineHeight: '14px',
            height: 35
        }
    },
    MinDepositBox: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        justifyContent: 'center',
        "@media (max-width: 681px)": {
            gap: 8
        },
        "&>span": {
            color: '#FFFFFF',
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "20px",
            textAlign: "center",
            textTransform: "uppercase",
            "@media (max-width: 681px)": {
                fontSize: 12,
                lineHeight: '14px'
            }
        },
        "&>div": {
            width: '120px',
            height: '42px',
            background: '#424253',
            borderRadius: '7px',
            border: '1px solid #424253',
            color: '#FFFFFF',
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "23px",
            textAlign: "center",
            textTransform: "uppercase",
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            "@media (max-width: 681px)": {
                width: 80,
                height: 30,
                fontSize: 14,
                lineHeight: '16px'
            },
        }
    }
}));

const DepositBonusCard = ({ cardNumber, minDeposit, percents, active = false }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const getCardTitle = () => {
        if (cardNumber === 1) return '1st';
        else if (cardNumber === 2) return '2nd';
        else if (cardNumber === 3) return '3rd';
        else return '4th';
    };

    const handleDeposit = () => {
        if (active)
            dispatch({ type: 'SET_WALLET_MODAL', data: true });
    };

    return (
        <Box className={clsx(classes.CardBox, active ? '' : classes.DeactiveCard)}>
            <Box className={classes.CardTitle}><span>{getCardTitle()}</span> Deposit</Box>
            <Box className={classes.UptoBox}>Up to</Box>
            <Box className={classes.PercentBox}>{percents[2]}%</Box>
            <Box className={classes.MinDepositBox}>
                <span>Min deposit:</span>
                <Box>
                    {minDeposit}
                </Box>
            </Box>
            <Button className={classes.DepositButton} onClick={handleDeposit}>Deposit now</Button>
        </Box>
    );
};

export default DepositBonusCard;