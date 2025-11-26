import { Looks3, Looks4, LooksOne, LooksTwo } from "@mui/icons-material";
import { Button, Box, ListItemIcon, ListItemText, MenuItem, MenuList, Stack, Switch, TextField, Typography } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { useEffect, useState, useContext } from "react";
import { getEnabledData, enableRewardSetting, saveDepositRewardSetting, getDepositSettingData } from "redux/action/reward";
import { LoadingContext } from "layout/Context/loading";
import { useToasts } from "react-toast-notifications";

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
    LineBox: {
        display: 'flex',
        width: '100%',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '20px'
    },
    InputBox: {
        width: '30%'
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

const RewardSetting = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const { addToast } = useToasts();

    const [enableReward, setEnableReward] = useState(true);
    const [depositSetting, setDepositSetting] = useState({
        Low: {
            startAmount: 0,
            endAmount: 0,
            percent: 0
        },
        Medium: {
            startAmount: 0,
            endAmount: 0,
            percent: 0
        },
        High: {
            startAmount: 0,
            endAmount: 0,
            percent: 0
        }
    });
    const [selectedMenu, setSelectedMenu] = useState(1);

    useEffect(() => {
        loadEnabledData();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        loadDepositSettingData();
        // eslint-disable-next-line
    }, [selectedMenu]);

    const loadEnabledData = async () => {
        showLoading();
        const response = await getEnabledData();
        if (response.status) {
            setEnableReward(response.data.enabled);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const loadDepositSettingData = async () => {
        showLoading();
        const response = await getDepositSettingData({ depositCount: selectedMenu });
        if (response.status) {
            let depositData = {
                Low: {
                    startAmount: 0,
                    endAmount: 0,
                    percent: 0
                },
                Medium: {
                    startAmount: 0,
                    endAmount: 0,
                    percent: 0
                },
                High: {
                    startAmount: 0,
                    endAmount: 0,
                    percent: 0
                }
            };
            // eslint-disable-next-line
            response.data.map((settingData) => {
                depositData[settingData.amountLevel] = {
                    startAmount: settingData.startAmount,
                    endAmount: settingData.endAmount,
                    percent: settingData.percent
                }
            });
            setDepositSetting({ ...depositData });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleEnableSetting = async (e) => {
        setEnableReward(e.target.checked)
        showLoading();
        const response = await enableRewardSetting({ enabled: e.target.checked });
        if (response.status)
            addToast(e.target.checked ? 'Reward Setting Enabled' : 'Reward Setting Disabled', { appearance: 'success', autoDismiss: true });
        hideLoading();
    };

    const handleSelectMenu = (menuNum) => {
        setSelectedMenu(menuNum)
    };

    const handleUpdateDepositSetting = (value, type, field) => {
        let depositData = { ...depositSetting };
        depositData[type][field] = value;
        setDepositSetting({ ...depositData });
    };

    const handleSaveDepositSetting = async () => {
        if (!validateSetting()) return;
        showLoading();
        const request = {
            depositCount: selectedMenu,
            data: depositSetting
        };
        const response = await saveDepositRewardSetting(request);
        if (response.status) {
            addToast('Successfully saved.', { appearance: 'success', autoDismiss: true });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const validateSetting = () => {
        if (depositSetting.Low.endAmount <= depositSetting.Low.startAmount) {
            addToast('End amount of Low should be great than start amount', { appearance: 'warning', autoDismiss: true });
            return false;
        }
        else if (depositSetting.Medium.endAmount <= depositSetting.Medium.startAmount) {
            addToast('End amount of Medium should be great than start amount', { appearance: 'warning', autoDismiss: true });
            return false;
        }
        else if (depositSetting.High.endAmount <= depositSetting.High.startAmount) {
            addToast('End amount of High should be great than start amount', { appearance: 'warning', autoDismiss: true });
            return false;
        }
        else if (depositSetting.Medium.startAmount <= depositSetting.Low.endAmount) {
            addToast('Start amount of Medium should be great than end amount of Low', { appearance: 'warning', autoDismiss: true });
            return false;
        }
        else if (depositSetting.High.startAmount <= depositSetting.Medium.endAmount) {
            addToast('Start amount of High should be great than end amount of Medium', { appearance: 'warning', autoDismiss: true });
            return false;
        }
        return true;
    }

    return (
        <Box>
            <Box className={classes.SubBox}>
                <h3 className={classes.SubBoxTitle}>Enable/Disable Reward</h3>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Disable</Typography>
                    <AntSwitch checked={enableReward} onChange={handleEnableSetting} />
                    <Typography>Enable Reward</Typography>
                </Stack>
            </Box>
            <Box className={classes.SubBox}>
                <h3 className={classes.SubBoxTitle}>Deposit Reward Setting</h3>
                <Box className={classes.MenuBox}>
                    <MenuList className={classes.MenuList}>
                        <MenuItem onClick={() => handleSelectMenu(1)} className={selectedMenu === 1 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <LooksOne />
                            </ListItemIcon>
                            <ListItemText>
                                First Deposit
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(2)} className={selectedMenu === 2 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <LooksTwo />
                            </ListItemIcon>
                            <ListItemText>
                                Second Deposit
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(3)} className={selectedMenu === 3 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <Looks3 />
                            </ListItemIcon>
                            <ListItemText>
                                Third Deposit
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(4)} className={selectedMenu === 4 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <Looks4 />
                            </ListItemIcon>
                            <ListItemText>
                                Fourth Deposit
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                    <Box className={classes.RewardDetail}>
                        <Box className={classes.LineBox}>
                            <Box className={classes.AmountTitle}>Low</Box>
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'Low', 'startAmount')}
                                value={depositSetting['Low']['startAmount']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="Start Amount"
                                type="number"
                            />
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'Low', 'endAmount')}
                                value={depositSetting['Low']['endAmount']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="End Amount"
                                type="number"
                            />
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'Low', 'percent')}
                                value={depositSetting['Low']['percent']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="Percent"
                                type="number"
                            />
                        </Box>
                        <Box className={classes.LineBox}>
                            <Box className={classes.AmountTitle}>Medium</Box>
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'Medium', 'startAmount')}
                                value={depositSetting['Medium']['startAmount']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="Start Amount"
                                type="number"
                            />
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'Medium', 'endAmount')}
                                value={depositSetting['Medium']['endAmount']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="End Amount"
                                type="number"
                            />
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'Medium', 'percent')}
                                value={depositSetting['Medium']['percent']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="Percent"
                                type="number"
                            />
                        </Box>
                        <Box className={classes.LineBox}>
                            <Box className={classes.AmountTitle}>High</Box>
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'High', 'startAmount')}
                                value={depositSetting['High']['startAmount']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="Start Amount"
                                type="number"
                            />
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'High', 'endAmount')}
                                value={depositSetting['High']['endAmount']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="End Amount"
                                type="number"
                            />
                            <TextField
                                onChange={(e) => handleUpdateDepositSetting(e.target.value, 'High', 'percent')}
                                value={depositSetting['High']['percent']}
                                className={classes.InputBox}
                                variant="outlined"
                                label="Percent"
                                type="number"
                            />
                        </Box>
                        <Box className={classes.ActionBox}>
                            <Button onClick={loadDepositSettingData} className={classes.ActionButton} variant="contained" color="success">Cancel</Button>
                            <Button onClick={handleSaveDepositSetting} className={classes.ActionButton} variant="contained">Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RewardSetting;