import { Box, Grid } from "@mui/material";
import parser from 'query-string';
import { useEffect, useState, useContext } from "react";
import { getTurtleDetail } from "redux/action/report";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";

const useStyles = makeStyles(() => ({
    DetailContainer: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    InfoContainer: {
        width: '100%',
        borderTop: '3px solid #d2d6de',
        background: '#FFF',
        padding: '10px'
    },
    InfoHeaderBox: {
        width: '100%',
        padding: '10px',
        fontSize: '18px',
        fontWeight: '800'
    },
    GridKeyItem: {
        padding: '8px',
        fontSize: '14px',
        color: '#000',
        fontWeight: '600',
        backgroundColor: '#f9f9f9',
        borderRight: '1px solid #dee2e6'
    },
    GridValueItem: {
        padding: '8px',
        fontSize: '14px',
        color: '#000',
        fontWeight: '200',
        borderLeft: 'none'
    },
    MainGrid: {
        border: '1px solid #dee2e6',
        "&>$RowGrid:last-child": {
            borderBottom: 'none'
        }
    },
    RowGrid: {
        borderBottom: '1px solid #dee2e6'
    },
    HistoryDetailContainer: {
        width: '100%',
        borderTop: '3px solid #00a65a',
        background: '#FFF',
        padding: '10px'
    },
    TextAlignCenter: {
        textAlign: 'center'
    },
    TextAlignRight: {
        textAlign: 'right'
    },
    TextAlignLeft: {
        textAlign: 'left'
    },
    CircleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const TurtleDetail = () => {
    const classes = useStyles();
    const [turtleDetail, setTurtleDetail] = useState(null);
    const { showLoading, hideLoading } = useContext(LoadingContext);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        const queryData = parser.parse(window.location.search);
        if (queryData?.id) {
            showLoading();
            const requestData = {
                id: queryData.id
            };
            const response = await getTurtleDetail(requestData);
            if (response.status)
                setTurtleDetail(response.data);
            hideLoading();
        }
    };

    const CircleItem = ({ position }) => {
        let color = position === 0 ? '#ff9314' : position === 1 ? '#f23068' : '#0d42ff'
        return (
            <Box style={{ width: `15px`, height: `15px`, background: `${color}`, borderRadius: '50%' }}></Box>
        );
    };

    return (
        <Box className={classes.DetailContainer}>
            <Box className={classes.InfoContainer}>
                <Box className={classes.InfoHeaderBox}>
                    Turtle Detail: {turtleDetail?.roundData?._id}
                </Box>
                <Grid container m={0}>
                    <Grid item md={6} xs={12} p={2}>
                        <Grid container m={0} className={classes.MainGrid}>
                            <Grid item xs={12} className={classes.RowGrid}>
                                <Grid container m={0}>
                                    <Grid item xs={4} className={classes.GridKeyItem}>
                                        Round Number
                                    </Grid>
                                    <Grid item xs={8} className={classes.GridValueItem}>
                                        {turtleDetail?.roundData?.roundNumber}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.RowGrid}>
                                <Grid container m={0}>
                                    <Grid item xs={4} className={classes.GridKeyItem}>
                                        Round Date
                                    </Grid>
                                    <Grid item xs={8} className={classes.GridValueItem}>
                                        {turtleDetail !== null ? new Intl.DateTimeFormat('en-US').format(new Date(turtleDetail?.roundData?.roundDate)) : ''}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6} xs={12} p={2}>
                        <Grid container m={0} className={classes.MainGrid}>
                            <Grid item xs={12} className={classes.RowGrid}>
                                <Grid container m={0}>
                                    <Grid item xs={4} className={classes.GridKeyItem}>
                                        Winner Info
                                    </Grid>
                                    <Grid item xs={8} className={classes.GridValueItem}>
                                        {turtleDetail?.roundData?.winnerInfo.toString()}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.RowGrid}>
                                <Grid container m={0}>
                                    <Grid item xs={4} className={classes.GridKeyItem}>
                                        Server Seed
                                    </Grid>
                                    <Grid item xs={8} className={classes.GridValueItem}>
                                        {turtleDetail?.roundData?.serverSeed}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box className={classes.HistoryDetailContainer}>
                <Box className={classes.InfoHeaderBox}>
                    Bet History
                </Box>
                <Box>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <td className={classes.TextAlignCenter}><strong>User Name</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Bet Amount</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Coin Type</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Payout</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Bet Turtle</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Win Turtle</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Profit</strong></td>
                                <td className={classes.TextAlignCenter}><strong>Is Win</strong></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                turtleDetail?.betHistory?.map((row) => (
                                    <tr key={row._id}>
                                        <td className={classes.TextAlignCenter}>{row.userName}</td>
                                        <td className={classes.TextAlignCenter}>{row.betAmount}</td>
                                        <td className={classes.TextAlignCenter}>{row.coinType.coinType}</td>
                                        <td className={classes.TextAlignCenter}>{row.payout}</td>
                                        <td className={clsx(classes.TextAlignCenter)}>
                                            <Box className={classes.CircleBox}>
                                                <CircleItem position={row.betTurtle} />
                                            </Box>
                                        </td>
                                        <td className={clsx(classes.TextAlignCenter)}>
                                            <Box className={classes.CircleBox}>
                                                <CircleItem position={row.winInfo.findIndex((item) => item === 0)} />
                                            </Box>
                                        </td>
                                        <td className={classes.TextAlignCenter}>{row.isWin ? Number(row.betAmount * (row.payout - 1)).toFixed(2) : `-${row.betAmount.toFixed(2)}`}</td>
                                        <td className={classes.TextAlignCenter}>{row.isWin ? 'Win' : 'Lost'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    );
};

export default TurtleDetail;