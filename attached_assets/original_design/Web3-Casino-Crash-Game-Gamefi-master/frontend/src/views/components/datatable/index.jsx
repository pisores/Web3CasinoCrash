import { Avatar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Config from "config/index";
import { useEffect, useState } from "react";
import { getBetHistoryData } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";
import { useDispatch } from "react-redux";

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
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'center',
        marginLeft: '19px',
        "&>img": {
            "@media (max-width: 681px)": {
                display: 'none'
            }
        }
    },
    PlayerDetailBox: {
        display: 'flex',
        gap: '2px',
        flexDirection: 'column',
        "&>span": {
            fontSize: '17px',
            fontWeight: '700',
            lineHeight: '21px',
            color: '#FFF'
        },
        "&>label": {
            color: '#6FE482',
            textTransform: 'uppercase',
            fontWeight: '700',
            fontSize: '12px',
            lineHeight: '15px'
        }
    },
    FlexBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
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
    }
}));

const DataTable = ({ historyState, gameType = "all" }) => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);
    const [newBetData, setNewBetData] = useState(null);

    useEffect(() => {
        getHistoryData();
        // eslint-disable-next-line
    }, [historyState]);

    useEffect(() => {
        Config?.Root?.socket?.off("updateBetHistory");
        Config?.Root?.socket?.on("updateBetHistory", (data) => {
            setNewBetData(data);
        });
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        if (newBetData !== null) {
            let oldData = tableData;
            if (Array.isArray(newBetData)) {
                oldData = newBetData.concat(oldData);
            }
            else {
                oldData = [newBetData].concat(oldData);
            }
            if (oldData.length > 10) {
                oldData.splice(10, oldData.length - 10);
            }
            setTableData([...oldData]);
        }
        // eslint-disable-next-line
    }, [newBetData]);

    const getHistoryData = async () => {
        const response = await getBetHistoryData({ gameType });
        if (response.status) {
            setTableData([...response.data]);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
    }

    return (
        <Box className={classes.DataTableBox}>
            <Box className={classes.DataTableHeader}>
                <Box style={{ width: '40%' }}>Player</Box>
                <Box style={{ width: '20%' }}>Bet</Box>
                <Box style={{ width: '20%' }}>Payout</Box>
                <Box style={{ width: '10%' }}>Multiplier</Box>
                <Box style={{ width: '10%', textAlign: 'right', paddingRight: '20px' }}>Game</Box>
            </Box>
            <Box className={classes.DataTableBody}>
                {
                    tableData.map((item, index) => {
                        return (
                            <Box className={classes.DataTableRow} key={index}>
                                <Box style={{ width: '40%' }}>
                                    <Box className={classes.PlayerInfoBox}>
                                        <img alt={item.userName} src="/assets/images/player_avatar.svg" />
                                        <Box className={classes.PlayerDetailBox}>
                                            <span>{item.userName}</span>
                                            <label>{`Adventurer-lv${item.userLevel}`}</label>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box style={{ width: '20%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType.coinType} src={`/assets/images/coins/${item.coinType.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span>{item.betAmount}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '20%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType.coinType} src={`/assets/images/coins/${item.coinType.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span
                                            className={
                                                item.roundResult === 'win' || item.roundResult === 'payout' ? classes.WinSpan
                                                    : item.roundResult === 'lost' ? classes.LostSpan
                                                        : ''
                                            }
                                        >
                                            {
                                                (item.roundResult === 'win' || item.roundResult === 'payout') ? (item.betAmount * item.payout).toFixed(2)
                                                    : item.roundResult === 'draw' || item.roundResult === 'finish' ? item.betAmount.toFixed(2) : `-${item.betAmount.toFixed(2)}`
                                            }
                                        </span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '10%' }}>
                                    <span style={{ color: '#FFF' }}>x{item.payout.toFixed(2)}</span>
                                </Box>
                                <Box style={{ width: '10%', textAlign: 'right', paddingRight: '20px' }}>
                                    <img alt='icon' src={`/assets/images/games/${item.gameType}.png`} width="30px" />
                                </Box>
                            </Box>
                        );
                    })
                }
            </Box>
        </Box>
    )
};

export default DataTable; 