import { Box, Table, TableHead, TableRow, TableSortLabel, TableCell, TableBody, Select, MenuItem, IconButton } from "@mui/material";
import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useDispatch } from "react-redux";
import { getWalletList } from "redux/action/report";
import { COINTYPES } from "config/constant";
import { Visibility } from "@mui/icons-material";
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
    TableHeaderBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        gap: '10px'
    },
    BalanceGroup: {
        display: 'flex',
        gap: '5px',
        marginTop: '3px'
    }
}));

const headCells = [
    { value: 'userName', label: 'User Name', ischeck: true },
    { value: 'address', label: 'Address', ischeck: true },
    { value: 'coinType', label: 'Coin Type', ischeck: true },
    { value: 'createdAt', label: 'Created At', ischeck: true },
    { value: 'detail', label: 'Detail', ischeck: true },
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

const WalletManagement = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');

    const [balanceData, setBalanceData] = useState({});
    const [data, setData] = useState([]);
    const [coinType, setCoinType] = useState('All');

    useEffect(() => {
        init();
        // eslint-disable-next-line
    }, [dispatch, coinType]);

    const init = async () => {
        showLoading();
        const response = await getWalletList({ coinType });
        if (response.status) {
            setData(response.data);
            setBalanceData(response.balance);
        }
        hideLoading();
    };

    const handleRequestSort = (property) => {
        let tempProperty = property;
        const isAsc = orderBy === tempProperty && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(tempProperty);
    };

    const handleDetail = () => {
        dispatch({ type: 'SET_MENU_PATH', data: 'wallet-detail' });
    };

    return (
        <Box className={classes.PlayerContainer}>
            <Box className={classes.TableHeaderBox}>
                <Box className={classes.TableTitleBox}>
                    All Wallets List
                </Box>
                <Box>
                    <Select
                        labelId="currencyType"
                        id="currencyType"
                        value={coinType}
                        onChange={(e) => setCoinType(e.target.value)}
                        className={classes.CustomSelect}
                    >
                        <MenuItem value={'All'} className={classes.CustomMenuItem}>
                            All
                        </MenuItem>
                        {
                            Object.keys(COINTYPES).map((key) => {
                                return (
                                    <MenuItem key={key} value={key} className={classes.CustomMenuItem}>
                                        <img className={classes.CurrencyIcon} src={key !== 'ZELO' ? `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${key.toLowerCase()}.svg` : 'https://img.icons8.com/arcade/64/null/cheap-2.png'} alt='icon' />
                                        <span>{key}</span>
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </Box>
                <Box className={classes.BalanceGroup}>
                    <span>Total Balance: </span>
                    {
                        balanceData &&
                        Object.keys(balanceData).map((key) => {
                            return (
                                <span key={key}>
                                    {balanceData[key].availableBalance} {key},
                                </span>
                            )
                        })
                    }
                </Box>
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
                            data.length > 0 &&
                            data?.map((item, index) => (
                                <TableRow key={index} className={classes.TableRow}>
                                    <TableCell>
                                        {item.userName}
                                    </TableCell>
                                    <TableCell>
                                        {item.address}
                                    </TableCell>
                                    <TableCell>
                                        {item.coinType}
                                    </TableCell>
                                    <TableCell>
                                        {item.createdAt}
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <Link to={`/payment/wallet-detail?id=${item._id}`}>
                                            <IconButton onClick={handleDetail} color="primary" aria-label="upload picture" component="span" className={classes.ActionButton}>
                                                <Visibility />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default WalletManagement;