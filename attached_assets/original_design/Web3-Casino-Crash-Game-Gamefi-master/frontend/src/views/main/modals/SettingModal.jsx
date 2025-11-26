import { Modal, Box, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import SettingSwitch from "views/components/switch/SettingSwitch";
import { useDispatch, useSelector } from "react-redux";
import SettingCheckBox from "views/components/checkbox/SettingCheckBox";
import { updateUserGameSetting } from "redux/actions/auth";
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

const SettingModal = ({ open, setOpen }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const handleClose = () => setOpen(false);

    const settingData = useSelector((state) => state.settingOption);
    const authData = useSelector((state) => state.authentication);
    const menuOption = useSelector((state) => state.menuOption);

    const updateSetting = async (key, value) => {
        if (authData.isAuth) {
            let setting = settingData;
            setting[key] = value;
            const request = {
                userId: authData.userData._id,
                settingData: setting
            };
            const response = await updateUserGameSetting(request);
            if (response.status) {
                dispatch({ type: 'INIT_SETTING', data: response.data });
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
                    <Box className={classes.ModalText}>Gameplay</Box>
                    {
                        menuOption.menuRouter !== '/scissors' &&
                        <Box className={classes.BoxLine}>
                            <span className={classes.LineTitle}>Animations</span>
                            <SettingSwitch check={settingData.animation} setCheck={() => updateSetting('animation', !settingData.animation)} disabled={false} />
                        </Box>
                    }
                    <Box className={classes.BoxLine}>
                        <span className={classes.LineTitle}>Audio</span>
                        <SettingSwitch check={settingData.sound} setCheck={() => updateSetting('sound', !settingData.sound)} disabled={false} />
                    </Box>
                    {
                        settingData.sound &&
                        <Box className={classes.SoundDetailBox}>
                            <SettingCheckBox label="Background music" checkKey='bgMusic' check={settingData.backgroundSound} setCheck={() => updateSetting('backgroundSound', !settingData.backgroundSound)} />
                            <SettingCheckBox label="Sound effects" checkKey='soundEffect' check={settingData.effectSound} setCheck={() => updateSetting('effectSound', !settingData.effectSound)} />
                        </Box>
                    }
                    <Box className={classes.BoxLine}>
                        <span className={classes.LineTitle}>Hotkey</span>
                        <SettingSwitch check={settingData.hotkey} setCheck={() => updateSetting('hotkey', !settingData.hotkey)} disabled={false} />
                    </Box>
                    <Box className={classes.BoxLine}>
                        <span className={classes.LineTitle}>Max bet</span>
                        <SettingSwitch check={settingData.maxBet} setCheck={() => updateSetting('maxBet', !settingData.maxBet)} disabled={false} />
                    </Box>
                    <Box className={classes.BoxLine}>
                        <Button className={classes.CloseButton} onClick={handleClose}>Close</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

SettingModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default SettingModal;