import { Modal, Box, IconButton, Button, Divider } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { ReactComponent as RefreshIcon } from "assets/icons/RefreshIcon.svg";
import { ReactComponent as EditIcon } from "assets/icons/EditIcon.svg";
import { useState } from "react";
import { generateSeed } from "help";
import { getSeedData, updateClientSeed, updateServerSeed } from "redux/actions/auth";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '160px',
        width: '616px',
        height: 'auto',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: '30px',
        padding: '49px 54px 36px 54px',
        "@media (max-width: 681px)": {
            width: '100%',
            borderRadius: '0px'
        }
    },
    ModalCloseButton: {
        position: 'absolute',
        top: '-32px',
        right: '-32px',
        width: '64px',
        height: '64px',
        color: '#55556F',
        background: '#2C2C3A',
        border: '6px solid #24252D',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        "@media (max-width: 370px)": {
            width: '90%'
        },
        "@media (max-width: 681px)": {
            padding: '20px'
        }
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
    ModalText: {
        width: '100%',
        textAlign: 'left',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "24px",
        lineHeight: "31px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    BoxLine: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    CloseButton: {
        width: '100%',
        height: '51px',
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: '8px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        marginTop: '20px'
    },
    Description: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        opacity: 0.5,
        margin: '17px 0px 35px 0px'
    },
    GroupTitle: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textTransform: "capitalize",
        color: "#FFFFFF",
        margin: '0px 0px 13px 0px',
        textAlign: 'left',
        width: '100%'
    },
    ClientSeedBox: {
        width: '100%',
        height: '41px',
        background: '#424253',
        borderRadius: '7px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: '10px'
    },
    HashSubBox: {
        width: '100%',
        padding: '19px 27px',
        background: '#424253',
        borderRadius: '7px',
        marginBottom: '8px'
    },
    HashTitleBox: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: "19px",
        textTransform: "capitalize",
        color: "#FFFFFF",
        marginBottom: '7px'
    },
    HashDataBox: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "155.2%",
        color: "#FFFFFF",
        overflowWrap: 'break-word'
    },
    RefreshIcon: {
        width: '51px',
        height: '100%',
        borderRadius: '7px 0px 0px 7px',
        background: 'rgba(255, 255, 255, 0.05)',
        "&>svg": {
            color: '#95959C'
        }
    },
    SeedInputBox: {
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        padding: '0px 15px 0px 15px',
        "&:disabled": {
            color: 'rgba(255, 255, 255, 0.6)'
        }
    },
    EditIcon: {
        width: '37px',
        height: '35px',
        borderRadius: '7px',
        background: 'rgba(255, 255, 255, 0.05)',
    },
    CloseIcon: {
        width: '37px',
        height: '35px',
        borderRadius: '7px',
        background: 'rgba(255, 255, 255, 0.05)',
        marginLeft: '5px',
        color: '#FFF'
    },
    CheckIcon: {
        width: '37px',
        height: '35px',
        borderRadius: '7px',
        background: 'rgba(255, 255, 255, 0.5)',
        color: '#FFF'
    }
}));

const FairModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const handleClose = () => setOpen(false);
    const { addToast } = useToasts();

    const authData = useSelector((state) => state.authentication);

    const [clientSeed, setClientSeed] = useState('');
    const [oldSeed, setOldSeed] = useState('');
    const [serverSeed, setServerSeed] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (authData.isAuth)
            loadSeedData();
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const handleClientSeed = (value) => {
        setClientSeed(value);
    };

    const handleRandom = async () => {
        if (authData.isAuth) {
            const request = {
                userId: authData.userData._id,
            };
            const response = await updateServerSeed(request);
            if (response.status) {
                setServerSeed(response.serverSeed);
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    };

    const handleEnableEdit = () => {
        setDisabled(false);
        setOldSeed(clientSeed);
    };

    const handleDisableEdit = () => {
        setDisabled(true);
        setClientSeed(oldSeed);
    };

    const handleCheckEdit = () => {
        updateClientSeedData(clientSeed);
    };

    const handleRefreshUserSeed = () => {
        const newSeed = generateSeed();
        updateClientSeedData(newSeed);
    };

    const loadSeedData = async () => {
        if (authData.isAuth) {
            const response = await getSeedData({ userId: authData.userData._id });
            if (response.status) {
                setClientSeed(response.data.clientSeed);
                setServerSeed(response.data.serverSeed);
            }
        }
    };

    const updateClientSeedData = async (seed) => {
        if (authData.isAuth) {
            const request = {
                userId: authData.userData._id,
                seed: seed
            };
            const response = await updateClientSeed(request);
            if (response.status) {
                setClientSeed(seed);
                setDisabled(true);
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
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
                <IconButton className={classes.ModalCloseButton} onClick={handleClose}>
                    <Close />
                </IconButton>
                <Box className={classes.ModalBodyBox}>
                    <Box className={classes.ModalText}>Fairness</Box>
                    <p className={classes.Description}>Playing on the website is secure. The fairness of all bets is unquestionable since we use cryptography to make sure every bet is transparently fair and can be checked.</p>
                    <Box className={classes.GroupTitle}>Client Seed</Box>
                    <Box className={classes.ClientSeedBox}>
                        <IconButton className={classes.RefreshIcon} onClick={handleRefreshUserSeed}><RefreshIcon /></IconButton>
                        <input tyep="text" value={clientSeed} onChange={(e) => handleClientSeed(e.target.value)} className={classes.SeedInputBox} disabled={disabled}></input>
                        {
                            disabled ?
                                <IconButton className={classes.EditIcon} onClick={handleEnableEdit}><EditIcon /></IconButton>
                                :
                                <>
                                    <IconButton className={classes.CheckIcon} onClick={handleCheckEdit}><Check /></IconButton>
                                    <IconButton className={classes.CloseIcon} onClick={handleDisableEdit}><Close /></IconButton>
                                </>
                        }
                    </Box>
                    <Divider style={{ margin: '27px 0px 23px 0px', width: '100%', borderColor: '#424253' }} />
                    <Box className={classes.GroupTitle}>Current</Box>
                    <Box className={classes.HashSubBox}>
                        <Box className={classes.HashTitleBox}>Server Seed (Hashed)</Box>
                        <Box className={classes.HashDataBox}>{serverSeed}</Box>
                    </Box>
                    <Box className={classes.HashSubBox}>
                        <Box className={classes.HashTitleBox}>Nonce</Box>
                        <Box className={classes.HashDataBox}>0</Box>
                    </Box>
                    <Box className={classes.BoxLine}>
                        <Button className={classes.CloseButton} onClick={handleRandom}>Randomize</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

FairModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default FairModal;