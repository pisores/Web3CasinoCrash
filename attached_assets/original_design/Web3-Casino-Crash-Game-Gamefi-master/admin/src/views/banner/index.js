import { Box, Button, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { getBannerText, updateBannerText } from "redux/action/report";

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
    TextInputBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        marginTop: 10
    },
    InputBox: {
        width: '100%'
    },
    ActionBox: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 20
    }
}));

const BannerManagement = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [topBannerData, setTopBannerData] = useState({ text1: '', text2: '', text3: '' });
    const [bottomBannerData, setBottomBannerData] = useState({ text1: '', text2: '', text3: '' });

    const [topEditData, setTopEditData] = useState({ text1: '', text2: '', text3: '' });
    const [bottomEditData, setBottomEditData] = useState({ text1: '', text2: '', text3: '' });

    const [topEditable, setTopEditable] = useState(false);
    const [bottomEditable, setBottomEditable] = useState(false);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await getBannerText();
        if (response.status) {
            let topData = response.data.find(item => item.type === 'top');
            setTopBannerData({ ...topData });
            let bottomData = response.data.find(item => item.type === 'bottom');
            setBottomBannerData({ ...bottomData });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleUpdateTopData = (key, value) => {
        let bannerData = { ...topBannerData };
        bannerData[key] = value;
        setTopBannerData({ ...bannerData });
    };

    const handleUpdateBottomData = (key, value) => {
        let bannerData = { ...bottomBannerData };
        bannerData[key] = value;
        setBottomBannerData({ ...bannerData });
    };

    const handleEditTopData = (flag) => {
        setTopEditable(flag);
        if (flag) {
            setTopEditData(topBannerData);
        }
        else {
            setTopBannerData(topEditData);
        }
    };

    const handleSaveTopData = async () => {
        showLoading();
        const response = await updateBannerText(topBannerData);
        if (response.status) {
            setTopEditable(false);
            initFunc();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleEditBottomData = (flag) => {
        setBottomEditable(flag);
        if (flag) {
            setBottomEditData(bottomBannerData);
        }
        else {
            setBottomBannerData(bottomEditData);
        }
    };

    const handleSaveBottomData = async () => {
        showLoading();
        const response = await updateBannerText(bottomBannerData);
        if (response.status) {
            setBottomEditable(false);
            initFunc();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box>
            <Box className={classes.SubBox}>
                <Typography className={classes.SubBoxTitle}>Top Banner Management</Typography>
                <Box className={classes.TextInputBox}>
                    <Typography>Text1</Typography>
                    <TextField
                        onChange={(e) => handleUpdateTopData('text1', e.target.value)}
                        value={topBannerData?.text1}
                        className={classes.InputBox}
                        variant="outlined"
                        type="text"
                        disabled={!topEditable}
                    />
                </Box>
                <Box className={classes.TextInputBox}>
                    <Typography>Text2</Typography>
                    <TextField
                        onChange={(e) => handleUpdateTopData('text2', e.target.value)}
                        value={topBannerData?.text2}
                        className={classes.InputBox}
                        variant="outlined"
                        type="text"
                        disabled={!topEditable}
                    />
                </Box>
                <Box className={classes.TextInputBox}>
                    <Typography>Text3</Typography>
                    <TextField
                        onChange={(e) => handleUpdateTopData('text3', e.target.value)}
                        value={topBannerData?.text3}
                        className={classes.InputBox}
                        variant="outlined"
                        type="text"
                        disabled={!topEditable}
                    />
                </Box>
                <Box className={classes.ActionBox}>
                    {
                        !topEditable ?
                            <Button variant="contained" onClick={() => handleEditTopData(true)}>Edit</Button>
                            :
                            <>
                                <Button variant="contained" color="secondary" onClick={handleSaveTopData}>Save</Button>
                                <Button variant="contained" color="warning" onClick={() => handleEditTopData(false)}>Cancel</Button>
                            </>
                    }
                </Box>
            </Box>
            <Box className={classes.SubBox}>
                <Typography className={classes.SubBoxTitle}>Bottom Banner Management</Typography>
                <Box className={classes.TextInputBox}>
                    <Typography>Text1</Typography>
                    <TextField
                        onChange={(e) => handleUpdateBottomData('text1', e.target.value)}
                        value={bottomBannerData?.text1}
                        className={classes.InputBox}
                        variant="outlined"
                        type="text"
                        disabled={!bottomEditable}
                    />
                </Box>
                <Box className={classes.TextInputBox}>
                    <Typography>Text2</Typography>
                    <TextField
                        onChange={(e) => handleUpdateBottomData('text2', e.target.value)}
                        value={bottomBannerData?.text2}
                        className={classes.InputBox}
                        variant="outlined"
                        type="text"
                        disabled={!bottomEditable}
                    />
                </Box>
                <Box className={classes.TextInputBox}>
                    <Typography>Text3</Typography>
                    <TextField
                        onChange={(e) => handleUpdateBottomData('text3', e.target.value)}
                        value={bottomBannerData?.text3}
                        className={classes.InputBox}
                        variant="outlined"
                        type="text"
                        disabled={!bottomEditable}
                    />
                </Box>
                <Box className={classes.ActionBox}>
                    {
                        !bottomEditable ?
                            <Button variant="contained" onClick={() => handleEditBottomData(true)}>Edit</Button>
                            :
                            <>
                                <Button variant="contained" color="secondary" onClick={handleSaveBottomData}>Save</Button>
                                <Button variant="contained" color="warning" onClick={() => handleEditBottomData(false)}>Cancel</Button>
                            </>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default BannerManagement;