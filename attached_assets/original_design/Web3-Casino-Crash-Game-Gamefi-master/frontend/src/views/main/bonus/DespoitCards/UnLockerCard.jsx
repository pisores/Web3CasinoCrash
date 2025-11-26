import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as HelpIcon } from "assets/icons/Help.svg";
import UnLockIcon from "assets/icons/unlocked.png";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { LoadingContext } from "layout/Context/loading";
import { claimLockedBalance, getUnlockBalance, getWargerBalance } from "redux/actions/auth";
import { useSelector } from "react-redux";

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
        justifyContent: 'flex-start',
        "@media (max-width: 1800px)": {
            width: 'calc(50% - 10px)'
        },
        "@media (max-width: 1298px)": {
            width: '100%'
        },
        "@media (max-width: 681px)": {
            height: 240,
            borderRadius: 4,
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
        margin: 'auto',
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

const UnLockerCard = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const authData = useSelector((state) => state.authentication);
    const [lockedData, setLockedData] = useState({});
    const [claimAmount, setClaimAmount] = useState(0);

    useEffect(() => {
        if (authData.isAuth) {
            initFunc();
        }
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const initFunc = async () => {
        showLoading();
        const response = await getUnlockBalance({ userId: authData.userData._id });
        if (response.status) {
            setLockedData(response.data);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        const response1 = await getWargerBalance({ userId: authData.userData._id });
        if (response1.status) {
            let availableAmount = Number(response1.data.wargeredAmount) - Number(response1.data.claimedAmount);
            if (availableAmount > response.data.lockedAmount) {
                setClaimAmount(response.data.lockedAmount)
            }
            else {
                setClaimAmount(availableAmount);
            }
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleClaim = async () => {
        if (authData.isAuth) {
            showLoading();
            const request = { userId: authData.userData._id, claimAmount: claimAmount };
            const response = await claimLockedBalance(request);
            if (response.status) {
                addToast(`${Number(request.claimAmount).toFixed(2)} is successfully claimed!`, { appearance: 'success', autoDismiss: true });
                initFunc();
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
            hideLoading();
        }
    };

    return (
        <Box className={classes.CardBox}>
            <Box className={classes.HelpIcon}>
                <HelpIcon />
            </Box>
            <Box className={classes.CardTitleBox}>
                <img src={UnLockIcon} alt="icon" width="61px" height="64px" />
                <span>Unlocker</span>
            </Box>
            <Box className={classes.BalanceContainer}>
                <Box className={classes.BalanceBox}>
                    <img alt="icon" src={'/assets/images/coins/zelo.png'} />
                    <span>
                        {
                            Number(claimAmount).toFixed(2)
                        }
                    </span>
                </Box>
            </Box>
            <Box className={classes.LockedCoinContainer}>
                <span className={classes.LockedCoinSpan}>Locked <label>ZELO</label> Balance:</span>
                <Box className={classes.LockedBalanceBox}>
                    <img alt="icon" src={'/assets/images/coins/zelo.png'} />
                    <span>{Number(lockedData?.lockedAmount).toFixed(2)}</span>
                </Box>
            </Box>
            <Button className={classes.ClaimButton} onClick={handleClaim}>Claim</Button>
        </Box>
    );
};

export default UnLockerCard;