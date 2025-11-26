import { Box, Table, TableHead, TableRow, TableSortLabel, TableCell, TableBody, IconButton, TablePagination, Fade, Card, CardContent, FormControl, CardActions, Button, Modal, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useDispatch, useSelector } from "react-redux";
import { loadDashBoardData, getPlayerdata } from "redux/action/report";
import { Input, Visibility } from '@mui/icons-material';
import { useToasts } from 'react-toast-notifications';
import Config from "config/index";
import { addAdminSpin, getSpinHistoryData } from "redux/action/reward";

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
        width: '50px'
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
    TextAlignCenter: {
        textAlign: 'center'
    },
}));

const headCells = [
    { value: 'id', label: 'ID', ischeck: true },
    { value: 'name', label: 'Name', ischeck: true },
    { value: 'email', label: 'Email', ischeck: true },
    { value: 'walletAddress', label: 'Wallet Address', ischeck: true },
    { value: 'detail', label: 'Detail', ischeck: true },
    { value: 'spin', label: 'Add Spin', ischeck: true }
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

const FreeSpinManagement = () => {
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

    const [spinCount, setSpinCount] = useState(0);
    const [spinReason, setSpinReason] = useState('');
    const [spinPlayer, setSpinPlayer] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const handleAddModalOpen = () => setAddModalOpen(true);
    const handleAddModalClose = () => {
        setSpinCount(0);
        setSpinReason('');
        setSpinPlayer('');
        setAddModalOpen(false);
    };

    const [detailData, setDetailData] = useState([]);
    const [detailModelOpen, setDetailModalOpen] = useState(false);
    const handleDetailModalOpen = () => setDetailModalOpen(true);
    const handleDetailModalClose = () => {
        setDetailModalOpen(false);
    };

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

    const handleDetail = async (id) => {
        showLoading();
        const response = await getSpinHistoryData({ userId: id });
        if (response.status) {
            setDetailData([...response.data]);
            handleDetailModalOpen();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const giveReward = async (id) => {
        setSpinPlayer(id);
        handleAddModalOpen();
    };

    const handleAddSpin = async () => {
        showLoading();
        const request = { spinCount, spinReason, spinPlayer };
        const response = await addAdminSpin(request);
        if (response.status) {
            addToast('Spin successfully added to user', { appearance: 'success', autoDismiss: true });
            handleAddModalClose();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    return (
        <Box className={classes.PlayerContainer}>
            <Box className={classes.TableTitleBox}>
                Free Spin Management
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
                                        {item._id}
                                    </TableCell>
                                    <TableCell>
                                        {item.userNickName}
                                    </TableCell>
                                    <TableCell>
                                        {item.userEmail}
                                    </TableCell>
                                    <TableCell>
                                        {item.loginType === 'Wallet' ? item.userName : ''}
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <IconButton onClick={() => handleDetail(item._id)} color="primary" component="span" className={classes.ActionButton}>
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <IconButton onClick={() => giveReward(item._id)} color="primary" component="span" className={classes.ActionButton}>
                                            <Input />
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
            <Modal
                open={addModalOpen}
                onClose={handleAddModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Fade in={addModalOpen}>
                        <Card sx={Config.customerModalStyle}>
                            <CardContent>
                                <FormControl variant="standard" fullWidth className={classes.NewSeed} sx={{ mb: 3 }}>
                                    <TextField
                                        variant="outlined"
                                        label="Free Spin Count"
                                        type="number"
                                        onChange={(e) => setSpinCount(e.target.value)}
                                        value={spinCount}
                                    />
                                </FormControl>
                                <FormControl variant="standard" fullWidth className={classes.NewSeed}>
                                    <TextField
                                        variant="outlined"
                                        label="Reason"
                                        onChange={(e) => setSpinReason(e.target.value)}
                                        value={spinReason}
                                    />
                                </FormControl>
                            </CardContent>
                            <CardActions className="d-flex justify-right pt-0">
                                <Button onClick={handleAddModalClose}>Cancel</Button>
                                <Button onClick={handleAddSpin} variant="contained">Save</Button>
                            </CardActions>
                        </Card>
                    </Fade>
                </Box>
            </Modal>
            <Modal
                open={detailModelOpen}
                onClose={handleDetailModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Fade in={detailModelOpen} style={{ width: '700px' }}>
                        <Card sx={Config.customerModalStyle}>
                            <CardContent>
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <td className={classes.TextAlignCenter}><strong>History Id</strong></td>
                                            <td className={classes.TextAlignCenter}><strong>Spin Count</strong></td>
                                            <td className={classes.TextAlignCenter}><strong>Reason</strong></td>
                                            <td className={classes.TextAlignCenter}><strong>Date</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            detailData.length > 0 && detailData.map((row, index) => (
                                                <tr key={index}>
                                                    <td className={classes.TextAlignCenter}>{row.historyId}</td>
                                                    <td className={classes.TextAlignCenter}>{row.count}</td>
                                                    <td className={classes.TextAlignCenter}>{row.reason}</td>
                                                    <td className={classes.TextAlignCenter}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(row.date))}</td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            detailData.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center' }}>No data</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </CardContent>
                            <CardActions className="d-flex justify-right pt-0">
                                <Button onClick={handleDetailModalClose} variant="contained">OK</Button>
                            </CardActions>
                        </Card>
                    </Fade>
                </Box>
            </Modal>
        </Box>
    );
};

export default FreeSpinManagement;