import { Box, Table, TableHead, TableRow, TableSortLabel, TableCell, TableBody, TablePagination } from "@mui/material";
import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useDispatch, useSelector } from "react-redux";
import { loadDashBoardData, getPlinkoData } from "redux/action/report";

const useStyles = makeStyles(() => ({
    PlayerContainer: {
        background: '#fff',
        borderRadius: '3px',
        borderTop: '3px solid #d2d6de',
        boxShadow: '0 1px 1px rgb(0 0 0 / 10%)',
        marginBottom: '20px',
        position: 'relative',
        width: '100%',
    },
    TableTitleBox: {
        color: '#444',
        padding: '10px',
        position: 'relative',
        display: 'inline-block',
        fontSize: '18px',
        lineHeight: '1',
    },
    TableMainBox: {
        padding: '10px',
        width: '100%'
    },
    TableHeaderCell: {
        background: 'rgb(231, 235, 240)',
        padding: '8px'
    },
    PlayerAvatar: {
        width: '30px',
        height: '30px'
    },
    ActionButton: {
        padding: '3px'
    },
    TableRow: {
        "&>.MuiTableCell-root": {
            padding: '6px'
        }
    },
    ActionCell: {
        width: '25px'
    },
    CustomSelect: {
        background: 'transparent',
        "&>.MuiSelect-select": {
            background: 'transparent',
            fontSize: '14px',
            fontWeight: '700',
            padding: '0px 10px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '5px',
            minWidth: '100px'
        }
    },
    CustomMenuItem: {
        display: 'flex',
        gap: '5px',
        fontSize: '14px',
        fontWeight: '700',
        height: '30px',
        padding: '10px 16px'
    },
    CurrencyIcon: {
        width: '20px',
        height: '20px'
    },
}));

const headCells = [
    { value: 'roundNumber', label: 'Round Number', ischeck: true },
    { value: 'roundDate', label: 'Round Date', ischeck: true },
    { value: 'userName', label: 'User Name', ischeck: true },
    { value: 'betAmount', label: 'Bet Amount', ischeck: true },
    { value: 'coinType', label: 'Coin Type', ischeck: true },
    { value: 'roundResult', label: 'Round Result', ischeck: true },
    { value: 'clientSeed', label: 'User Seed', ischeck: true },
    { value: 'serverSeed', label: 'Server Seed', ischeck: true },
    { value: 'payout', label: 'Payout', ischeck: true },
];

const EnhancedTableHead = (props) => {
    let { order, orderBy, onRequestSort } = props;
    const classes = useStyles();

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, key) => (
                    <TableCell key={key} className={classes.TableHeaderCell}>
                        {
                            headCell.ischeck ?
                                <TableSortLabel
                                    active={orderBy === headCell.value}
                                    direction={orderBy === headCell.value ? order : 'asc'}
                                    onClick={() => onRequestSort(headCell.value)}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                                :
                                <>{headCell.label}</>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const PlinkoManagement = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const userAuth = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [data, setData] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        init()
        // eslint-disable-next-line
    }, [dispatch, rowsPerPage, page]);

    const init = async () => {
        showLoading();
        const userId = userAuth?.userData?._id;
        const response = await loadDashBoardData({ id: userId });
        if (response.status) {
            setTotalRows(Number(response.plinkoCount));
            const requestData = {
                id: userId,
                offset: page,
                count: rowsPerPage
            }
            const response1 = await getPlinkoData(requestData);
            if (response1.status) {
                setData(response1.diceData);
            }
        }
        hideLoading();
    };

    const handleRequestSort = (property) => {
        let tempProperty = property;
        const isAsc = orderBy === tempProperty && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(tempProperty);
    };

    const handlePageChange = (value) => {
        setPage(value - 1)
    };

    const changePerPage = (value) => {
        setRowsPerPage(value);
    };

    return (
        <Box className={classes.PlayerContainer}>
            <Box className={classes.TableTitleBox}>
                All Plinko Rounds
            </Box>
            <Box className={classes.TableMainBox}>
                <Table>
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {
                            data?.map((item) => (
                                <TableRow key={item._id} className={classes.TableRow}>
                                    <TableCell>
                                        {item.roundNumber}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US').format(new Date(item.roundDate))}
                                    </TableCell>
                                    <TableCell>
                                        {item.userData.userNickName}
                                    </TableCell>
                                    <TableCell>
                                        {Number(item.betAmount).toFixed(4)}
                                    </TableCell>
                                    <TableCell>
                                        {item.coinType.coinType}
                                    </TableCell>
                                    <TableCell style={{ textTransform: 'capitalize' }}>
                                        {item.payout > 1 ? 'Win' : item.payout === 1 ? 'Draw' : 'Lost'}
                                    </TableCell>
                                    <TableCell>
                                        {item.clientSeed}
                                    </TableCell>
                                    <TableCell>
                                        {item.serverSeed}
                                    </TableCell>
                                    <TableCell>
                                        {item.payout}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalRows}
                    onPageChange={(e, v) => handlePageChange(v + 1)}
                    onRowsPerPageChange={(e) => changePerPage(e.target.value)}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Box>
        </Box>
    );
};

export default PlinkoManagement;