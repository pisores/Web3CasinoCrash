import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as HelpIcon } from "assets/icons/Help.svg";
import JackpotIcon from "assets/icons/jackpot.png";
import CryptoIcon from "assets/icons/Crypto3.png";

const useStyles = makeStyles(() => ({
    CardBox: {
        width: "calc(33% - 13px)",
        height: "368px",
        backgroundColor: "#2C2C3A",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        backgroundImage: "url('/assets/images/unlockerbg.png')",
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        "@media (max-width: 1800px)": {
            width: 'calc(50% - 10px)'
        },
        "@media (max-width: 1298px)": {
            width: '100%'
        },
        "@media (max-width: 681px)": {
            height: 240,
            borderRadius: 4,
            gap: 12,
            padding: 8
        }
    },
    HelpIcon: {
        position: 'absolute',
        width: "36px",
        height: "38px",
        right: "15px",
        top: "15px",
        background: "#424253",
        borderRadius: "8px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        "@media (max-width: 681px)": {
            width: 30,
            height: 32,
            borderRadius: 4,
            top: 6,
            right: 6
        }
    },
    CardTitleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '16px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "20px",
            textAlign: "right",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "@media (max-width: 681px)": {
            gap: 6,
            "&>span": {
                fontSize: 12,
                lineHeight: '14px'
            },
            "&>img": {
                width: 30,
                height: 32
            }
        }
    },
    BalanceContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "4px",
        flexDirection: 'column',
        gap: '5px'
    },
    BalanceBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        width: '152px',
        height: '69px',
        background: '#424253',
        border: 'solid 1px #424253',
        borderRadius: '7px',
        "&>img": {
            width: '28px',
            height: '28px'
        },
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "26px",
            lineHeight: "33px",
            textAlign: "right",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "@media (max-width: 681px)": {
            gap: 6,
            width: 80,
            height: 40,
            borderRadius: 3,
            "&>img": {
                width: 20,
                height: 20
            },
            "&>span": {
                fontSize: 14,
                lineHeight: '18px'
            }
        }
    },
    LockedBalanceBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '113px',
        height: '42px',
        background: '#424253',
        border: 'solid 1px #424253',
        borderRadius: '7px',
        "&>img": {
            width: '28px',
            height: '28px'
        },
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "23px",
            textAlign: "right",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "@media (max-width: 681px)": {
            gap: 4,
            width: 80,
            height: 36,
            borderRadius: 3,
            "&>img": {
                width: 20,
                height: 20
            },
            "&>span": {
                fontSize: 14,
                lineHeight: '18px'
            }
        }
    },
    LockedCoinContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '27px',
        marginTop: '34px',
        "@media (max-width: 681px)": {
            marginTop: 14,
            gap: 12
        }
    },
    LockedCoinSpan: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textAlign: "right",
        textTransform: "uppercase",
        color: "#FFFFFF",
        "&>label": {
            color: '#6FE482'
        },
        "@media (max-width: 681px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    DetailText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#FFFFFF",
        textAlign: 'center',
        "@media (max-width: 681px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    }
}));

const JackpotCard = () => {
    const classes = useStyles();

    return (
        <Box className={classes.CardBox}>
            <Box className={classes.HelpIcon}>
                <HelpIcon />
            </Box>
            <Box className={classes.CardTitleBox}>
                <img src={JackpotIcon} alt="icon" width="56px" height="58px" />
                <span>Jackpot</span>
            </Box>
            <Box className={classes.BalanceContainer}>
                <Box className={classes.BalanceBox}>
                    <img alt="icon" src={CryptoIcon} />
                    <span>0.00</span>
                </Box>
                <span className={classes.LockedCoinSpan}>Progressive bonus</span>
            </Box>
            <Box className={classes.DetailText}>
                You only need a bet to have a chance of winning the best progressive Jackpote!
            </Box>
        </Box>
    );
};

export default JackpotCard;