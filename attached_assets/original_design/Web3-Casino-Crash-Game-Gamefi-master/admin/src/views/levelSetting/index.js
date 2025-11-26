import { Looks5, Looks3, Looks4, LooksOne, LooksTwo, Looks6 } from "@mui/icons-material";
import { Box, Button, ListItemIcon, ListItemText, MenuItem, MenuList, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { getUserLevelList, saveUserLevelData } from "redux/action/report";
import { LoadingContext } from "layout/Context/loading";

const useStyles = makeStyles(() => ({
    MainLayout: {
        backgroundColor: '#FFF',
        width: '100%',
        padding: '20px',
        background: '#FFF',
        borderTop: 'solid 5px #3c8dbc',
        marginBottom: '20px'
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
    SettingBox: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    SettingDataBox: {
        width: '100%'
    }
}));

const LevelSetting = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [selectedMenu, setSelectedMenu] = useState(1);
    const [levelData, setLevelData] = useState([]);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await getUserLevelList();
        if (response.status) {
            setLevelData([...response.data]);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleSelectMenu = (menuNum) => {
        setSelectedMenu(menuNum)
    };

    const handleChangeLabel = (value) => {
        let tmpData = [...levelData];
        tmpData[selectedMenu - 1].label = value;
        setLevelData([...tmpData]);
    };

    const handleChangeData = (value, index) => {
        let tmpData = [...levelData];
        tmpData[selectedMenu - 1].data[index] = value;
        setLevelData([...tmpData]);
    };

    const handleSave = async () => {
        showLoading();
        const response = await saveUserLevelData({ data: levelData });
        if (response.status) {
            addToast('Successfully saved!', { appearance: 'success', autoDismiss: true });
            initFunc();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box className={classes.MainLayout}>
            <Box pb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>User Level Setting</Typography>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </Box>
            {
                levelData.length > 0 &&
                <Box className={classes.SettingBox}>
                    <MenuList className={classes.MenuList}>
                        <MenuItem onClick={() => handleSelectMenu(1)} className={selectedMenu === 1 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <LooksOne />
                            </ListItemIcon>
                            <ListItemText>
                                {levelData[0]?.label}
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(2)} className={selectedMenu === 2 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <LooksTwo />
                            </ListItemIcon>
                            <ListItemText>
                                {levelData[1]?.label}
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(3)} className={selectedMenu === 3 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <Looks3 />
                            </ListItemIcon>
                            <ListItemText>
                                {levelData[2]?.label}
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(4)} className={selectedMenu === 4 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <Looks4 />
                            </ListItemIcon>
                            <ListItemText>
                                {levelData[3]?.label}
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(5)} className={selectedMenu === 5 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <Looks5 />
                            </ListItemIcon>
                            <ListItemText>
                                {levelData[4]?.label}
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSelectMenu(6)} className={selectedMenu === 6 ? classes.ActiveMenu : ''}>
                            <ListItemIcon>
                                <Looks6 />
                            </ListItemIcon>
                            <ListItemText>
                                {levelData[5]?.label}
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                    <Box className={classes.SettingDataBox}>
                        <TextField
                            id="label-control"
                            label="Label"
                            variant="outlined"
                            value={levelData[selectedMenu - 1]?.label}
                            onChange={(e) => handleChangeLabel(e.target.value)}
                        />
                        <Box mt={2} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {
                                levelData[selectedMenu - 1]?.data?.map((item, index) => (
                                    <TextField
                                        key={(selectedMenu - 1) * 10 + index}
                                        type="Number"
                                        variant="outlined"
                                        label={`Level${(selectedMenu - 1) * 10 + index}`}
                                        value={item}
                                        onChange={(e) => handleChangeData(e.target.value, index)}
                                        sx={{
                                            width: 200
                                        }}
                                    />
                                ))
                            }
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    );
};

export default LevelSetting;