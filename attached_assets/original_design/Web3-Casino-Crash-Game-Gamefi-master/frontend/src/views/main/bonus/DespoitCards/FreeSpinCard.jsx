import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as HelpIcon } from "assets/icons/Help.svg";
import FreeSpinIcon from "assets/icons/freespin.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpinCount } from "redux/actions/auth";
import { useState } from "react";

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
        marginTop: "4px"
    },
    BalanceBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        width: '60px',
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
    ClaimButton: {
        width: "196px",
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
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '48px',
        "@media (max-width: 681px)": {
            height: 30,
            width: 120,
            borderRadius: 4,
            fontSize: 12,
            lineHeight: '14px',
            marginTop: 36
        }
    }
}));

const FreeSpinCard = () => {
    const classes = useStyles();
    const authData = useSelector((state) => state.authentication);
    const dispatch = useDispatch();

    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if (authData.isAuth)
            initFunc();
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const initFunc = async () => {
        const response = await getSpinCount({ userId: authData.userData._id });
        if (response.status) {
            setTotalCount(response.data.count);
        }
    };

    const showSpinModal = () => {
        dispatch({ type: 'SET_SPIN_MODAL', data: true });
    };

    return (
        <Box className={classes.CardBox}>
            <Box className={classes.HelpIcon}>
                <HelpIcon />
            </Box>
            <Box className={classes.CardTitleBox}>
                <img src={FreeSpinIcon} alt="icon" width="56px" height="55px" />
                <span>Free Spin</span>
            </Box>
            <Box className={classes.BalanceContainer}>
                <Box className={classes.BalanceBox}>
                    <span>{totalCount}</span>
                </Box>
            </Box>
            <Box className={classes.LockedCoinContainer}>
                <span className={classes.LockedCoinSpan}>Available spins</span>
            </Box>
            <Button className={classes.ClaimButton} onClick={showSpinModal}>Spin Now</Button>
        </Box>
    );
};

export default FreeSpinCard;