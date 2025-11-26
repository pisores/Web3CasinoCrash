import { Box, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SoundOnIcon from "assets/icons/SoundOn.png";
import SoundOffIcon from "assets/icons/SoundOff.png";
import SettingIcon from "assets/icons/SettingIcon.png";
import FairIcon from "assets/icons/FairIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { updateUserGameSetting } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    SettingBox: {
        display: 'flex',
        position: 'absolute',
        top: '17px',
        right: '17px',
        gap: '9px',
        zIndex: '3'
    },
    IconButton: {
        borderRadius: '50%',
        width: '52px',
        height: '52px',
        background: 'linear-gradient(45deg, #975cee, #6b4bd9)',
        "@media (max-width: 940px)": {
            width: '39px',
            height: '39px',
            "&>img": {
                width: '70%'
            }
        }
    }
}));

const SettingBox = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const settingData = useSelector((state) => state.settingOption);
    const authData = useSelector((state) => state.authentication);

    const handleSetSound = async () => {
        if (authData.isAuth) {
            let setting = settingData;
            setting['sound'] = !settingData.sound;
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

    const handleSettingModal = () => {
        dispatch({ type: 'SET_SETTING_MODAL', data: true });
    };

    const handleFairModal = () => {
        dispatch({ type: 'SET_FAIR_MODAL', data: true });
    };

    return (
        <Box className={classes.SettingBox}>
            <IconButton className={classes.IconButton} onClick={handleSetSound}>
                {
                    settingData.sound ?
                        <img src={SoundOnIcon} alt="Icon" width="29px" />
                        :
                        <img src={SoundOffIcon} alt="Icon" width="36px" />
                }
            </IconButton>
            <IconButton className={classes.IconButton} onClick={handleSettingModal}>
                <img src={SettingIcon} alt="Icon" width="33px" />
            </IconButton>
            <IconButton className={classes.IconButton} onClick={handleFairModal}>
                <img src={FairIcon} alt="Icon" width="32px" />
            </IconButton>
        </Box>
    );
};

export default SettingBox;