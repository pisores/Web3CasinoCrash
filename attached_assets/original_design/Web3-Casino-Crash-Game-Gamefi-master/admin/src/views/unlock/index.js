import { Box, Button, Stack, Switch, TextField, Typography } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import { getUnlockSetting, updateUnlockSetting } from "redux/action/reward";
import { useToasts } from "react-toast-notifications";
import { LoadingContext } from "layout/Context/loading";

const useStyles = makeStyles(() => ({
    SubBox: {
        width: '100%',
        padding: '20px',
        background: '#FFF',
        borderTop: 'solid 5px #3c8dbc',
        marginBottom: '20px'
    },
    SubBoxTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '10px'
    },
    InputBox: {
        width: '200px'
    },
    InputLayout: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    }
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const UnlockSetting = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [settingData, setSettingData] = useState({
        id: '',
        enable: true,
        percent: 0
    });

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await getUnlockSetting();
        if (response.status) {
            if (response.data !== null) {
                setSettingData({
                    ...{ id: response.data._id, enable: response.data.enable, percent: response.data.percent }
                });
            }
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    }

    const handleEnableSetting = (key, value) => {
        if (key === 'percent' && (value < 0 || value > 100)) {
            addToast('Percent should be great than 0 and smaller than 100', { appearance: 'warning', autoDismiss: true });
            return;
        }
        let data = settingData;
        data[key] = value;
        setSettingData({ ...data });
    };

    const saveSetting = async () => {
        showLoading();
        const response = await updateUnlockSetting(settingData);
        if (response.status) {
            addToast('Unlock setting data saved successfully!', { appearance: 'success', autoDismiss: true });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    }

    return (
        <Box>
            <Box className={classes.SubBox}>
                <h3 className={classes.SubBoxTitle}>Enable/Disable Unlock</h3>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Disable</Typography>
                    <AntSwitch checked={settingData.enable} onChange={(e) => handleEnableSetting('enable', e.target.checked)} />
                    <Typography>Enable Unlock</Typography>
                </Stack>
            </Box>
            <Box className={classes.SubBox}>
                <h3 className={classes.SubBoxTitle}>Set Unlock Percent</h3>
                <Box className={classes.InputLayout}>
                    <TextField
                        onChange={(e) => handleEnableSetting('percent', e.target.value)}
                        value={settingData.percent}
                        className={classes.InputBox}
                        variant="outlined"
                        label="Unlock Percent"
                        type="number"
                    />
                    <Button variant="contained" onClick={saveSetting}>Save</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UnlockSetting;