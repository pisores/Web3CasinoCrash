import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as HelpIcon } from "assets/icons/Help.svg";
import RechargeIcon from "assets/icons/Tournaments.png";

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
            padding: 8,
            justifyContent: 'flex-start'
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
            textAlign: "center",
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
        marginTop: "4px"
    },
    BalanceBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        width: '100%',
        height: '259px',
        background: '#424253',
        border: 'solid 1px #424253',
        borderRadius: '7px',
        paddingLeft: '41px',
        paddingRight: '41px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "28px",
            color: "#FFFFFF",
            textAlign: 'center'
        },
        "@media (max-width: 681px)": {
            gap: 6,
            height: 160,
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
    }
}));

const RechargeCard = () => {
    const classes = useStyles();

    return (
        <Box className={classes.CardBox}>
            <Box className={classes.HelpIcon}>
                <HelpIcon />
            </Box>
            <Box className={classes.CardTitleBox}>
                <img src={RechargeIcon} alt="icon" width="39px" height="34px" />
                <span>Recharge</span>
            </Box>
            <Box className={classes.BalanceContainer}>
                <Box className={classes.BalanceBox}>
                    <span>Begin playing games to receive the recharge bonus.</span>
                </Box>
            </Box>
        </Box>
    );
};

export default RechargeCard;