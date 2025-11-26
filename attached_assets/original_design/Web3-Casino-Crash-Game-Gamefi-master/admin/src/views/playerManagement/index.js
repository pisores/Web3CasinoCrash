import { Box, Table, TableHead, TableRow, TableSortLabel, TableCell, TableBody, IconButton, TablePagination, Select, MenuItem } from "@mui/material";
import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useDispatch, useSelector } from "react-redux";
import { loadDashBoardData, getPlayerdata, deletePlayerData } from "redux/action/report";
import { Delete, Visibility } from '@mui/icons-material';
import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";

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
    { value: 'name', label: 'Name', ischeck: true },
    { value: 'email', label: 'Email', ischeck: true },
    { value: 'walletAddress', label: 'Wallet Address', ischeck: true },
    { value: 'balance', label: 'Balance', ischeck: true },
    { value: 'detail', label: 'Detail', ischeck: true },
    { value: 'delete', label: 'Delete', ischeck: true }
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

const PlayerManagement = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const userAuth = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();
    const { addToast } = useToasts();

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
            setTotalRows(Number(response.user_count));
            const requestData = {
                id: userId,
                offset: page,
                count: rowsPerPage
            }
            const response1 = await getPlayerdata(requestData);
            if (response1.status) {
                setData(response1.user_data);
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

    const handleDelete = async (id) => {
        confirmAlert({
            title: '',
            message: 'Do you really want to remove this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        showLoading();
                        const userId = userAuth?.userData?._id;
                        const response = await deletePlayerData({ id: userId, user_id: id });
                        if (response.status) {
                            addToast(response.message, { appearance: 'success', autoDismiss: true });
                            init();
                        }
                        else {
                            addToast(response.message, { appearance: 'error', autoDismiss: true });
                        }
                        hideLoading();
                    }
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    const handleDetail = () => {
        dispatch({ type: 'SET_MENU_PATH', data: '/player/player-detail' });
    };

    return (
        <Box className={classes.PlayerContainer}>
            <Box className={classes.TableTitleBox}>
                All Player
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
                                        {item.userNickName}
                                    </TableCell>
                                    <TableCell>
                                        {item.userEmail}
                                    </TableCell>
                                    <TableCell>
                                        {item.loginType === 'Wallet' ? item.userName : ''}
                                    </TableCell>
                                    <TableCell style={{ width: '30%' }}>
                                        <Select
                                            labelId="currencyType"
                                            id="currencyType"
                                            className={classes.CustomSelect}
                                            value={0}
                                        >
                                            {
                                                item.balance.data.map((balance, index) => {
                                                    return (
                                                        <MenuItem key={index} value={index} className={classes.CustomMenuItem} >
                                                            {/* <img className={classes.CurrencyIcon} src={key !== 'ZELO' ? `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${key.toLowerCase()}.svg` : 'https://img.icons8.com/arcade/64/null/cheap-2.png'} alt='icon' /> */}
                                                            <img src={`/assets/images/coins/${balance.coinType.toLowerCase()}.png`} className={classes.CurrencyIcon} alt="icon" />
                                                            <span>{balance.coinType} {balance.type === 'native' ? '' : `(${balance.type})`} : {balance.balance}</span>
                                                        </MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <Link to={`/player/player-detail?id=${item._id}`}>
                                            <IconButton onClick={handleDetail} color="primary" aria-label="upload picture" component="span" className={classes.ActionButton}>
                                                <Visibility />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <IconButton onClick={() => handleDelete(item._id)} color="primary" aria-label="upload picture" component="span" className={classes.ActionButton}>
                                            <Delete />
                                        </IconButton>
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

export default PlayerManagement;