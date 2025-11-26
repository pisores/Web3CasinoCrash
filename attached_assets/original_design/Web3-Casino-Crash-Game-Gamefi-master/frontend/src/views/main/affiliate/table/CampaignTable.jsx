import { Avatar, Box, Button, IconButton, Typography, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addCampaignList, getCampaignList } from "redux/actions/auth";
import clsx from "clsx";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles(() => ({
    DataTableBox: {
        width: '100%'
    },
    DataTableHeader: {
        display: 'flex',
        borderBottom: 'solid 1px rgba(255, 255, 255, 0.1)',
        padding: '9px 11px 9px 17px',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '18px',
        textTransform: 'uppercase',
        color: '#FFF',
        marginBottom: '13px',
        "@media (max-width: 1045px)": {
            display: 'none'
        }
    },
    DataTableRow: {
        cursor: 'pointer',
        width: '100%',
        height: '70px',
        background: '#2C2C3A',
        borderRadius: '8px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        "@media (max-width: 681px)": {
            justifyContent: 'space-between',
            "&>div:nth-child(2)": {
                display: 'none'
            },
            "&>div:nth-child(4)": {
                display: 'none'
            },
            "&>div:nth-child(1)": {
                width: '50% !important'
            },
            "&>div:nth-child(3)": {
                width: '30% !important'
            },
            "&>div:nth-child(5)": {
                width: '20% !important'
            }
        }
    },
    PlayerInfoBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        // alignItems: 'center',
        marginLeft: '19px'
    },
    FlexBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: 4,
        background: '#424253',
        borderRadius: 5,
        width: '70px',
        "&>span": {
            fontFamily: 'Styrene A Web',
            fontWeight: '700',
            fontSize: '14px',
            lineHeight: '18px',
            textTransform: 'uppercase',
            color: '#FFF'
        }
    },
    WinSpan: {
        color: '#6FE482 !important'
    },
    LostSpan: {
        color: 'red !important'
    },
    DefaultBox: {
        width: 80,
        height: 23,
        background: '#6FE482',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1F1E25',
        textTransform: 'uppercase',
        fontSize: 12,
        lineHeight: '15px',
        fontWeight: 700,
        fontFamily: 'Styrene A Web'
    },
    UserCountText: {
        fontFamily: 'Cera Pro',
        fontSize: 12,
        fontWeight: 700,
        lineHeight: '15px',
        color: '#FFF',
        textTransform: 'uppercase',
        "&>span": {
            color: '#68CE7B'
        }
    },
    AddCampaignButton: {
        color: '#1F1E25',
        width: 196,
        height: 51,
        fontSize: 14,
        background: '#FED847',
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        borderRadius: 8,
        textTransform: 'uppercase'
    },
    NewCampContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    ModalBox: {
        marginTop: '160px',
        width: '533px',
        height: '245px',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px',
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
        padding: '0px 26px 0px 45px',
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
    ModalButton: {
        borderRadius: '8px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        height: '55px'
    },
    CloseButton: {
        background: "#2C2C3A",
        border: "1px solid #363646",
        width: '183px'
    },
    ConfirmButton: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        width: '242px'
    },
    ActionBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ModalText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 900,
        fontSize: "18px",
        lineHeight: "31px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        opacity: 0.5,
        textAlign: 'justify'
    },
    CodeInput: {
        background: '#424253',
        borderRadius: 8,
        width: '100%',
        height: 51,
        outline: 'none',
        border: 'none',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: 14,
        color: "#FFFFFF",
        paddingLeft: '13px',
        paddingRight: '13px',
        "&::placeholder": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "18px",
            color: "#FFFFFF"
        }
    },
}));

const CampaignTable = ({
    handleDetail
}) => {
    const classes = useStyles();
    const authData = useSelector((state) => state.authentication);
    const { addToast } = useToasts();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [tableData, setTableData] = useState([
    ]);

    useEffect(() => {
        if (authData.isAuth) {
            initFunc();
        }
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const initFunc = async () => {
        const response = await getCampaignList({ userId: authData.userData._id });
        if (response.status) {
            let data = [];
            // eslint-disable-next-line
            response.data.map((item) => {
                const newData = {
                    userCount: item.count,
                    campaignType: item.name,
                    code: item.code,
                    wageredCommission: item.wargerAmount,
                    perUserReward: 0,
                    tireCommission: 0,
                    totalCommission: 0,
                    coinType: 'ZELO'
                };
                data.push(newData);
            });
            setTableData([...data]);
        }
    };

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const handleSave = async () => {
        if (authData.isAuth) {
            const response = await addCampaignList({ userId: authData.userData._id, name });
            if (response.status) {
                addToast('Successfully saved!', { appearance: 'success', autoDismiss: true });
                handleClose();
                setName('');
                initFunc();
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    };

    return (
        <Box className={classes.DataTableBox}>
            <Box className={classes.NewCampContainer}>
                <Button onClick={handleOpen} className={classes.AddCampaignButton}>Add Campaign</Button>
            </Box>
            <Box className={classes.DataTableHeader}>
                <Box style={{ width: '25%' }}>Player</Box>
                <Box style={{ width: '15%' }}>Code</Box>
                <Box style={{ width: '15%' }}>Wagered Commission</Box>
                <Box style={{ width: '15%' }}>Per user rewards</Box>
                <Box style={{ width: '15%' }}>Tire Commissions</Box>
                <Box style={{ width: '15%' }}>Total Commissions</Box>
            </Box>
            <Box className={classes.DataTableBody}>
                {
                    tableData.map((item, index) => {
                        return (
                            <Box className={classes.DataTableRow} key={index} onClick={() => handleDetail(item.code, item.campaignType)}>
                                <Box style={{ width: '25%' }}>
                                    <Box className={classes.PlayerInfoBox}>
                                        <Box className={classes.DefaultBox}>{item.campaignType}</Box>
                                        <Typography className={classes.UserCountText}>User: <span>{item.userCount}</span></Typography>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <span style={{ color: '#FFF' }}>{item.code}</span>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 20, height: 20 }} />
                                        <span>{item.wageredCommission}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 20, height: 20 }} />
                                        <span>{item.perUserReward}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 20, height: 20 }} />
                                        <span>{item.tireCommission}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 20, height: 20 }} />
                                        <span>{item.totalCommission}</span>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })
                }
            </Box>
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
                        <span className={classes.ModalText}>New Campaign</span>
                        <input type="text" className={classes.CodeInput} placeholder="Campaign Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Box className={classes.ActionBox}>
                            <Button className={clsx(classes.ModalButton, classes.CloseButton)} onClick={handleClose}>Cancel</Button>
                            <Button className={clsx(classes.ModalButton, classes.ConfirmButton)} onClick={handleSave}>Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
};

export default CampaignTable; 