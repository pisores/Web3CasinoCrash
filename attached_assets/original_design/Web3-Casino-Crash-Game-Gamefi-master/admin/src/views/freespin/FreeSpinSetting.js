import { AddRounded } from "@mui/icons-material";
import { Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import SpinSettingInputBox from "./SpinSettingInputBox";
import { LoadingContext } from "layout/Context/loading";
import { useToasts } from "react-toast-notifications";
import { getFreeSpinSetting, insertFreeSpinSetting, updateFreeSpinSetting, deleteFreeSpinSetting } from "redux/action/reward";

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
    MenuBox: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    MenuList: {
        width: '200px',
        background: '#d2d3d3',
        border: 'solid 1px #afafaf',
        padding: '0px',
        "&>li": {
            borderBottom: 'solid 1px',
            opacity: '0.7'
        },
        "&>li:last-child": {
            borderBottom: 'none'
        }
    },
    ActiveMenu: {
        opacity: '1 !important'
    },
    RewardDetail: {
        width: '100%',
        padding: '0px 20px'
    },
    AmountTitle: {
        width: '10%'
    },
    ActionBox: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '16px'
    },
    ActionButton: {
    }
}));

const FreeSpinSetting = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [spinData, setSpinData] = useState([]);

    useEffect(() => {
        loadSpinSettingData();
        // eslint-disable-next-line
    }, []);

    const loadSpinSettingData = async () => {
        showLoading();
        const response = await getFreeSpinSetting();
        if (response.status) {
            let settingData = [];
            // eslint-disable-next-line
            response.data.map((data) => {
                settingData.push({
                    startLevel: data.startLevel,
                    endLevel: data.endLevel,
                    count: data.count,
                    isNew: false,
                    id: data._id,
                    editable: false
                });
            });
            setSpinData([...settingData]);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const addNewSetting = () => {
        let newSetting = { startLevel: 0, endLevel: 0, count: 0, editable: true, isNew: true };
        setSpinData((oldData) => [...oldData, newSetting]);
    };

    const handleSettingData = (index, key, value) => {
        let settingData = spinData;
        if (key === 'editable' && settingData[index]['isNew']) {
            settingData.splice(index, 1);
        }
        else {
            settingData[index][key] = value;
        }
        setSpinData([...settingData]);
    };

    const handleSaveData = async (index) => {
        let settingData = spinData;
        if (settingData[index].isNew) {
            const response = await insertFreeSpinSetting(settingData[index]);
            if (response.status) {
                addToast('New Setting Data Saved Successfully!', { appearance: 'success', autoDismiss: true });
                loadSpinSettingData();
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
        else {
            const response = await updateFreeSpinSetting(settingData[index]);
            if (response.status) {
                addToast('Setting Data Updated Successfully!', { appearance: 'success', autoDismiss: true });
                loadSpinSettingData();
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    }

    const handleDeleteData = async (index) => {
        let settingData = spinData;
        const response = await deleteFreeSpinSetting(settingData[index]);
        if (response.status) {
            addToast('Setting Data Deleted Successfully!', { appearance: 'success', autoDismiss: true });
            loadSpinSettingData();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
    }

    return (
        <Box>
            <Box className={classes.SubBox}>
                <h3 className={classes.SubBoxTitle}>Free Spin Count Setting</h3>
                <Box className={classes.MenuBox}>
                    <Box className={classes.RewardDetail}>
                        {
                            spinData.map((data, index) => {
                                return (
                                    <SpinSettingInputBox
                                        key={index}
                                        {...data}
                                        index={index}
                                        handleSettingData={handleSettingData}
                                        handleSaveData={handleSaveData}
                                        handleDeleteData={handleDeleteData}
                                    />
                                );
                            })
                        }
                        <Box className={classes.ActionBox}>
                            <Button className={classes.ActionButton} onClick={addNewSetting} variant="contained" color="secondary">
                                <AddRounded />
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.SubBox}>
                <h3 className={classes.SubBoxTitle}>Free Spin Amount Setting</h3>
                <Box className={classes.MenuBox}>
                </Box>
            </Box>
        </Box>
    );
};

export default FreeSpinSetting;