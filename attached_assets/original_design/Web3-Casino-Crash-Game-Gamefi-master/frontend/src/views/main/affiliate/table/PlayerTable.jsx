import { Avatar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";

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

const PlayerTable = ({ userData }) => {
    const classes = useStyles();

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        let tmpData = [];
        // eslint-disable-next-line
        userData.map((data, index) => {
            let wargerData = data.wargerData;
            let tmpRow = {
                userName: data.userNickName,
                userLevel: data.userLevel,
                regDate: new Date(data.createdAt),
                wageredAmount: wargerData.length > 0 ? wargerData[0].totalWargerAmount : 0,
                bonusAmount: 0,
                tireAmount: 0,
                totalEarned: 0,
                coinType: 'ZELO'
            }
            tmpData.push(tmpRow);
        });
        setTableData([...tmpData]);
        // eslint-disable-next-line
    }, [userData]);

    return (
        <Box className={classes.DataTableBox}>
            <Box className={classes.DataTableHeader}>
                <Box style={{ width: '25%' }}>Player</Box>
                <Box style={{ width: '15%' }}>Member since</Box>
                <Box style={{ width: '15%' }}>Wagered</Box>
                <Box style={{ width: '15%' }}>New players bonus</Box>
                <Box style={{ width: '15%' }}>From tires</Box>
                <Box style={{ width: '15%' }}>Total earned</Box>
            </Box>
            <Box className={classes.DataTableBody}>
                {
                    tableData.map((item, index) => {
                        return (
                            <Box className={classes.DataTableRow} key={index}>
                                <Box style={{ width: '25%' }}>
                                    <Box className={classes.PlayerInfoBox}>
                                        <img alt={item.userName} src="/assets/images/player_avatar.svg" />
                                        <Box className={classes.PlayerDetailBox}>
                                            <span>{item.userName}</span>
                                            <label>{`Adventurer-lv${item.userLevel}`}</label>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <span style={{ color: '#FFF' }}>{new Intl.DateTimeFormat('en-US', {}).format(new Date(item.regDate))}</span>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span>{item.wageredAmount.toFixed(4)}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span>{item.bonusAmount.toFixed(4)}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span>{item.tireAmount.toFixed(4)}</span>
                                    </Box>
                                </Box>
                                <Box style={{ width: '15%' }}>
                                    <Box className={classes.FlexBox}>
                                        <Avatar alt={item.coinType} src={`/assets/images/coins/${item.coinType.toLowerCase()}.png`} sx={{ width: 28, height: 28 }} />
                                        <span>{item.totalEarned.toFixed(4)}</span>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })
                }
            </Box>
        </Box>
    )
};

export default PlayerTable; 