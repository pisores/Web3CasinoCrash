import { Modal, Box, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import SettingSwitch from "views/components/switch/SettingSwitch";
import { useDispatch, useSelector } from "react-redux";
import { updatePrivacyData } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '160px',
        width: '538px',
        height: 'auto',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: '30px',
        padding: '48px 58px 51px 58px',
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
        gap: '24px',
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
    LineTitle: {
        fontFamily: "'Cera Pro'",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "18px",
        lineHeight: "23px",
        color: "#FFFFFF"
    },
    SoundDetailBox: {
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0px',
        width: '100%'
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
        color: "#FFFFFF"
    }
}));

const PrivacyModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const handleClose = () => setOpen(false);

    const authData = useSelector((state) => state.authentication);
    const privacyData = useSelector((state) => state.privacyOption);

    const handlePrivacyData = async (key, value) => {
        if (authData.isAuth) {
            let privacy = privacyData;
            privacy[key] = value;
            const request = {
                userId: authData.userData._id,
                privateProfile: privacy.privateProfile,
                showOnlineIndicator: privacy.showOnlineIndicator
            };
            const response = await updatePrivacyData(request);
            if (response.status) {
                const data = {
                    privateProfile: response.data.privateProfile,
                    showOnlineIndicator: response.data.showOnlineIndicator
                };
                dispatch({ type: 'INIT_PRIVACY', data });
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
                    <Box className={classes.ModalText}>Privacy</Box>
                    <Box className={classes.BoxLine}>
                        <span className={classes.LineTitle}>Private profile</span>
                        <SettingSwitch check={privacyData.privateProfile} setCheck={(value) => handlePrivacyData('privateProfile', value)} disabled={false} />
                    </Box>
                    <Box className={classes.BoxLine}>
                        <span className={classes.LineTitle}>Show online indicator</span>
                        <SettingSwitch check={privacyData.showOnlineIndicator} setCheck={(value) => handlePrivacyData('showOnlineIndicator', value)} disabled={false} />
                    </Box>
                    <Box className={classes.BoxLine}>
                        <Button className={classes.CloseButton} onClick={handleClose}>Close</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

PrivacyModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default PrivacyModal;