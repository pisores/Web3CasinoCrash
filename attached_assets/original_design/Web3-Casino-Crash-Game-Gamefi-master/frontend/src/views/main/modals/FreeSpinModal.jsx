import { Modal, Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import FreeSpinIcon from "assets/icons/freespin.png";
import { useEffect, useState } from "react";
import clsx from "clsx";
import TimeCount from "views/components/timecount";
import { useSelector } from "react-redux";
import { getSpinCount, updateSpinCount } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '40px',
        width: '842px',
        height: '900px',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        borderRadius: '20px',
        padding: '18px 15px 40px 18px',
        "@media (max-width: 940px)": {
            width: 680,
            height: 550
        },
        "@media (max-width: 681px)": {
            width: '100%',
            borderRadius: '0px',
            padding: 0
        }
    },
    ModalCloseButton: {
        position: 'absolute',
        top: '-32px',
        left: '50%',
        transform: 'translate(-50%)',
        width: '64px',
        height: '64px',
        color: '#55556F',
        background: '#2C2C3A',
        border: '6px solid #24252D',
        zIndex: 4,
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
        width: '100%',
        // "@media (max-width: 370px)": {
        //     width: '90%'
        // },
        "@media (max-width: 681px)": {
            padding: '10px'
        }
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
    SpinIconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        "@media (max-width: 681px)": {
            marginTop: 20
        }
    },
    SpinIconTextBox: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
    },
    FreeSpinIcon: {
        width: 105,
        "@media (max-width: 940px)": {
            width: 50
        }
    },
    IconBoxTitle: {
        fontFamily: 'Styrene A Web',
        fontSize: 21,
        lineHeight: '27px',
        textTransform: 'uppercase',
        fontWeight: 900,
        color: '#FFF',
        "@media (max-width: 940px)": {
            fontSize: 14,
            lineHeight: '18px',
            fontWeight: 500
        }
    },
    SpinCountText: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        width: 48,
        height: 40,
        borderRadius: 3,
        fontFamily: 'Styrene A Web',
        fontSize: 21,
        lineHeight: '27px',
        textTransform: 'uppercase',
        fontWeight: 900,
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        "@media (max-width: 940px)": {
            width: 36,
            height: 30,
            fontSize: 14,
            lineHeight: '18px'
        }
    },
    LevelSelectBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 53,
        "@media (max-width: 940px)": {
            marginTop: 0,
            gap: 10,
            padding: '24px 0px',
            overflowY: 'auto'
        }
    },
    LevelBox: {
        border: '2px solid #424253',
        borderRadius: 3,
        width: 260,
        height: 103,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        "@media (max-width: 940px)": {
            width: '100%',
            height: 80
        }
    },
    SelectedLevelBox: {
        borderColor: '#5A45D1'
    },
    LevelItemText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: '20px',
        textTransform: 'uppercase',
        color: '#FFF',
        "@media (max-width: 940px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    FromLevelBox: {
        width: 40,
        height: 22,
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        lineHeight: '14px',
        textTransform: 'uppercase',
        marginLeft: 25,
        color: '#FFF',
        "@media (max-width: 940px)": {
            width: 30,
            height: 16,
            fontSize: 10,
            lineHeight: '12px'
        }
    },
    SelectedLevelBg: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%) !important'
    },
    LevelLabelBox: {
        width: 124,
        height: 39,
        background: '#424253',
        borderRadius: 3,
        position: 'absolute',
        top: -20,
        left: '50%',
        transform: 'translate(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Styrene A Web',
        fontSize: 19,
        lineHeight: '24px',
        color: '#FFF',
        fontWeight: 700,
        textTransform: 'uppercase',
        "@media (max-width: 940px)": {
            width: 80,
            height: 30,
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    LevelBTCBox: {
        background: '#424253',
        borderRadius: 15,
        width: 173,
        height: 39,
        position: 'absolute',
        bottom: -20,
        left: '50%',
        transform: 'translate(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Styrene A Web',
        fontSize: 19,
        lineHeight: '24px',
        color: '#FFF',
        fontWeight: 700,
        textTransform: 'uppercase',
        "@media (max-width: 940px)": {
            width: 90,
            height: 30,
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    SpinContainer: {
        marginTop: 47,
        position: 'relative',
        margin: 'auto',
        width: 423,
        "@media (max-width: 940px)": {
            width: 300,
            marginTop: 17
        }
    },
    WheelBox: {
        width: '423px',
        height: '423px',
        background: 'url(/assets/images/spin/spin.png)',
        backgroundSize: 'cover',
        "@media (max-width: 940px)": {
            width: 300,
            height: 300
        }
    },
    WheelContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        "&>div:nth-child(1)": {
            rotate: '-11deg'
        },
        "&>div:nth-child(2)": {
            rotate: '-33.5deg'
        },
        "&>div:nth-child(3)": {
            rotate: '-56deg'
        },
        "&>div:nth-child(4)": {
            rotate: '-78.5deg'
        },
        "&>div:nth-child(5)": {
            rotate: '-101deg'
        },
        "&>div:nth-child(6)": {
            rotate: '-123.5deg'
        },
        "&>div:nth-child(7)": {
            rotate: '-146deg'
        },
        "&>div:nth-child(8)": {
            rotate: '-168.5deg'
        },
        "&>div:nth-child(9)": {
            rotate: '-191deg'
        },
        "&>div:nth-child(10)": {
            rotate: '-213.5deg'
        },
        "&>div:nth-child(11)": {
            rotate: '-236deg'
        },
        "&>div:nth-child(12)": {
            rotate: '-258.5deg'
        },
        "&>div:nth-child(13)": {
            rotate: '-281deg'
        },
        "&>div:nth-child(14)": {
            rotate: '-303.5deg'
        },
        "&>div:nth-child(15)": {
            rotate: '-326deg'
        },
        "&>div:nth-child(16)": {
            rotate: '-348.5deg'
        }
    },
    PointerBox: {
        width: '104px',
        height: '104px',
        position: 'absolute',
        background: 'url(/assets/images/spin/pointer.png)',
        backgroundSize: 'cover',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        "@media (max-width: 940px)": {
            width: 73.76,
            height: 73.76
        }
    },
    CursorBox: {
        width: 19,
        height: 21.5,
        position: 'absolute',
        background: 'url(/assets/images/spin/cursor.png)',
        backgroundSize: 'cover',
        right: 12,
        top: -5
    },
    AmountLabel: {
        width: '100%',
        height: '50%',
        fontFamily: "'Styrene A Web'",
        fontWeight: 700,
        fontSize: "18.9197px",
        lineHeight: "24px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        position: 'absolute',
        top: '0px',
        left: '0px',
        transformOrigin: 'bottom center',
        paddingTop: 'calc(50% - 13px)',
        paddingLeft: 'calc(100% - 145px)',
        "@media (max-width: 940px)": {
            fontSize: 11,
            lineHeight: '12px',
            paddingTop: 'calc(50% - 6px)',
            paddingLeft: 'calc(100% - 96px)'
        }
    },
    WinningBox: {
        background: 'url("/assets/images/spin/winning.png")',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 3
    },
    WinningDataBox: {
        position: 'absolute',
        display: 'flex',
        left: 312,
        bottom: 205
    },
    WinCoinImg: {
        width: 91,
        height: 90
    },
    WinningAmount: {
        fontFamily: 'Styrene A Web',
        fontWeight: 900,
        fontSize: 28,
        lineHeight: '32px',
        color: '#FFF',
        marginTop: '16px'
    },
    SpinLockBox: {
        background: '#2C2C3A',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 3,
        opacity: 0.94,
        borderRadius: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    SpinLockTitle: {
        fontFamily: 'Styrene A Web',
        fontSize: 32,
        lineHeight: '36px',
        textTransform: 'uppercase',
        color: '#FFF',
        fontWeight: 900,
        "@media (max-width: 940px)": {
            fontSize: 24,
            lineHeight: '28px'
        }
    }
}));

const FreeSpinModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const handleClose = () => setOpen(false);
    const authData = useSelector((state) => state.authentication);

    const [spinCount, setSpinCount] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState(0);

    const [showWinning, setShowWinning] = useState(false);
    const [winningAmount, setWinningAmount] = useState(0.01);
    const [targetDate, setTargetDate] = useState(new Date());

    const levelSettingData = [
        { label: 'Rookie', fromLevel: 0, winBTC: 1 },
        { label: 'Super', fromLevel: 20, winBTC: 2 },
        { label: 'VIP', fromLevel: 40, winBTC: 3 }
    ];
    const rewardValues = [
        [0.01, 0.05, 0.03, 0.02, 1.0, 0.01, 0.02, 0.05, 0.01, 0.03, 0.05, 0.01, 0.02, 0.03, 0.05, 0.01],
        [0.1, 0.5, 0.3, 0.2, 2.0, 0.1, 0.2, 0.5, 0.2, 0.3, 0.5, 1, 0.2, 0.3, 0.5, 0.1],
        [1, 5, 3, 2, 3, 1, 2, 5, 2, 3, 5, 3, 2, 3, 5, 1]
    ];

    useEffect(() => {
        if (authData.isAuth)
            initFunc();
        // eslint-disable-next-line
    }, [authData.isAuth]);

    useEffect(() => {
        if (showWinning) {
            updateSpinData();
        }
        // eslint-disable-next-line
    }, [showWinning]);

    const initFunc = async () => {
        const response = await getSpinCount({ userId: authData.userData._id });
        if (response.status) {
            setSpinCount(response.data.count);
            if (response.data.count === 0) {
                setTargetDate(response.data.availableDate);
            }
        }
    };

    const updateSpinData = async () => {
        const response = await updateSpinCount({ userId: authData.userData._id, winAmount: winningAmount });
        if (response.status) {
            setSpinCount(response.data.count);
            setTargetDate(response.data.availableDate);
            setTimeout(() => {
                setShowWinning(false);
            }, 3000);
        }
    };

    const handleSpin = () => {
        if (spinCount > 0) {
            let time = 0;
            let rotatedDegree = 0;
            const wheelElem = document.getElementById("wheel-box");

            const spinRotate = setInterval(() => {
                time += 10;
                let speed = angularVelocity(time);
                rotatedDegree += speed;
                wheelElem.style.transform = `rotate(${rotatedDegree}deg)`;

                if (speed <= 0) {
                    setWinningAmount(0.01);
                    clearInterval(spinRotate);
                    setShowWinning(true);
                }
            }, 10);
        }
    };

    const angularVelocity = (t) => {
        const k1 = 0.002; // Increase constant
        const k2 = 6.05; // Constant speed constant
        const k3 = 0.002; // Decrease constant
        const T1 = 2000; // Time to reach maximum speed
        const T2 = 4000; // Time to maintain maximum speed
        const T3 = 6000; // Time to stop completely

        if (t < T1) {
            return k1 * t;
        } else if (t < T2) {
            return k2;
        } else if (t <= T3) {
            return k3 * (T3 - t);
        } else {
            return 0;
        }
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
                {
                    showWinning &&
                    <Box className={classes.WinningBox}>
                        <Box className={classes.WinningDataBox}>
                            <img src="/assets/images/spin/wincoin.png" alt="wincoin" className={classes.WinCoinImg} />
                            <span className={classes.WinningAmount}>{0.01}</span>
                        </Box>
                    </Box>
                }
                {
                    (!showWinning && spinCount === 0) &&
                    <Box className={classes.SpinLockBox}>
                        <Typography className={classes.SpinLockTitle}>Time Left</Typography>
                        <TimeCount targetDate={targetDate} />
                    </Box>
                }
                <IconButton className={classes.ModalCloseButton} onClick={handleClose}>
                    <Close />
                </IconButton>
                <Box className={classes.ModalBodyBox}>
                    <Box className={classes.SpinIconBox}>
                        <img src={FreeSpinIcon} alt="freespin" className={classes.FreeSpinIcon} />
                        <Box className={classes.SpinIconTextBox}>
                            <span className={classes.IconBoxTitle}>Magic wheel</span>
                            <Box className={classes.SpinCountText}>{spinCount}</Box>
                        </Box>
                    </Box>
                    <Box className={clsx(classes.LevelSelectBox, 'NoScroll')}>
                        {
                            levelSettingData.map((item, index) => (
                                <Box
                                    onClick={() => setSelectedLevel(index)}
                                    key={index}
                                    className={clsx(classes.LevelBox, selectedLevel === index ? classes.SelectedLevelBox : '')}
                                >
                                    <Box style={{ display: 'flex' }}>
                                        <span className={classes.LevelItemText}>Starting from</span>
                                        <Box className={classes.FromLevelBox}>LV{item.fromLevel}</Box>
                                    </Box>
                                    <Box className={clsx(classes.LevelLabelBox, selectedLevel === index ? classes.SelectedLevelBg : '')}>
                                        {item.label}
                                    </Box>
                                    <Box className={clsx(classes.LevelBTCBox, selectedLevel === index ? classes.SelectedLevelBg : '')}>
                                        Win&nbsp;<span style={{ color: '#FED847' }}>{item.winBTC} BTC</span>
                                    </Box>
                                </Box>
                            ))
                        }
                    </Box>
                    <Box className={classes.SpinContainer}>
                        <Box className={classes.WheelBox} id="wheel-box">
                            <Box className={classes.WheelContainer}>
                                {
                                    rewardValues[selectedLevel].map((item, index) => (
                                        <Box key={index} className={classes.AmountLabel}>{item.toFixed(4)}</Box>
                                    ))
                                }
                            </Box>
                        </Box>
                        <Box className={classes.PointerBox} onClick={handleSpin}>
                            <Box className={classes.CursorBox}></Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

FreeSpinModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default FreeSpinModal;