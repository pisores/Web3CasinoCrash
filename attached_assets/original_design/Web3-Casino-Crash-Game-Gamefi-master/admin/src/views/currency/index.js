import { Box, Button, Card, CardActions, CardContent, Checkbox, Fade, FormControl, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import Config from "config/index";
import { useToasts } from "react-toast-notifications";
import { LoadingContext } from "layout/Context/loading";
import { Delete, Edit } from "@mui/icons-material";
import { confirmAlert } from "react-confirm-alert";
import { insertCurrency, readCurrency, removeCurrency, updateCurrency } from "redux/action/payment";

const useStyles = makeStyles(() => ({
    MainLayout: {
        background: '#fff',
        borderRadius: '3px',
        borderTop: '3px solid #d2d6de',
        boxShadow: '0 1px 1px rgb(0 0 0 / 10%)',
        marginBottom: '20px',
        position: 'relative',
        width: '100%',
    },
    PageTitleBox: {
        color: '#444',
        padding: '10px',
        position: 'relative',
        display: 'flex',
        fontSize: '18px',
        lineHeight: '1',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    TableMainBox: {
        padding: '10px',
        width: '100%'
    },
    TableHeaderCell: {
        background: 'rgb(231, 235, 240)',
        padding: '8px'
    },
    AvailabelBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
}));

const headCells = [
    { value: 'number', label: 'No', ischeck: true },
    { value: 'currencyName', label: 'Currency Name', ischeck: true },
    { value: 'decimal', label: 'Decimal', ischeck: true },
    { value: 'regDate', label: 'Registered Date', ischeck: true },
    { value: 'edit', label: 'Edit', ischeck: true },
    { value: 'delete', label: 'Delete', ischeck: true },
    { value: 'available', label: 'Available', ischeck: true },
    { value: 'withdrawable', label: 'Withdrawable', ischeck: true },
    { value: 'swapable', label: 'Swapable', ischeck: true },
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

const CurrencyManagement = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(0);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const [newCurrencyData, setNewCurrencyData] = useState({
        currencyName: '',
        fullName: '',
        available: true,
        decimal: 0,
        token: '',
        withdrawable: true,
        swapable: true
    });
    const [editData, setEditData] = useState({});

    const [currencyList, setCurrencyList] = useState([
    ]);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await readCurrency();
        if (response.status) {
            setCurrencyList(response.data);
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleRequestSort = (property) => {
        let tempProperty = property;
        const isAsc = orderBy === tempProperty && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(tempProperty);
    };

    const handleNewCurrency = () => {
        setModalType(0);
        handleModalOpen();
    };

    const handleNewCurrencyData = (key, value) => {
        let data = newCurrencyData;
        data[key] = value;
        setNewCurrencyData({ ...data });
    };

    const handleEditCurrencyData = (key, value) => {
        let data = editData;
        data[key] = value;
        setEditData({ ...data });
    }

    const handleSaveNewCurrency = async () => {
        showLoading();
        const response = await insertCurrency(newCurrencyData);
        if (response.status) {
            addToast('Successfully Saved!', { appearance: 'success', autoDismiss: true });
            setNewCurrencyData({
                currencyName: '',
                fullName: '',
                available: true
            });
            initFunc();
            handleModalClose();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const handleDeleteCurrency = async (id) => {
        confirmAlert({
            title: '',
            message: 'Do you really want to remove this currency?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        showLoading();
                        const response = await removeCurrency({ currencyId: id });
                        if (response.status) {
                            addToast('This currency successfully removed!', { appearance: 'success', autoDismiss: true });
                            initFunc();
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
        });
    };

    const handleEdit = async (data) => {
        setEditData(data);
        setModalType(1);
        handleModalOpen();
    };

    const handleEditCurrency = async () => {
        showLoading();
        const response = await updateCurrency(editData);
        if (response.status) {
            addToast('Successfully Saved!', { appearance: 'success', autoDismiss: true });
            setEditData({});
            initFunc();
            handleModalClose();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    };

    const AvailableRect = ({ available }) => {
        return (
            <Box style={{ width: 20, height: 20, backgroundColor: !available ? 'red' : 'green' }}></Box>
        );
    };

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.PageTitleBox}>
                <span>Currency List</span>
                <Button variant="contained" onClick={handleNewCurrency}>Add New Currency</Button>
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
                            currencyList?.map((item, index) => (
                                <TableRow key={item._id} className={classes.TableRow}>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {item.currencyName}
                                    </TableCell>
                                    <TableCell>
                                        {item.decimal}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.regDate))}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(item)}><Edit /></IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteCurrency(item._id)}><Delete /></IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <AvailableRect available={item.available} />
                                    </TableCell>
                                    <TableCell>
                                        <AvailableRect available={item.withdrawable} />
                                    </TableCell>
                                    <TableCell>
                                        <AvailableRect available={item.swapable} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Fade in={modalOpen}>
                        {
                            modalType === 0 ?
                                <Card sx={Config.customerModalStyle}>
                                    <CardContent>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField label="Currency Name" variant="outlined" value={newCurrencyData.currencyName} onChange={(e) => handleNewCurrencyData('currencyName', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Full Name" variant="outlined" value={newCurrencyData.fullName} onChange={(e) => handleNewCurrencyData('fullName', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Token" variant="outlined" value={newCurrencyData.token} onChange={(e) => handleNewCurrencyData('token', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Decimal" variant="outlined" value={newCurrencyData.decimal} onChange={(e) => handleNewCurrencyData('decimal', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={newCurrencyData.available}
                                                onChange={(e) => handleNewCurrencyData('available', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newCurrencyData.available ? 'Available' : 'Unavailable'}</span>
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={newCurrencyData.withdrawable}
                                                onChange={(e) => handleNewCurrencyData('withdrawable', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newCurrencyData.withdrawable ? 'Withdrawable' : 'Unwithdrawable'}</span>
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={newCurrencyData.swapable}
                                                onChange={(e) => handleNewCurrencyData('swapable', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newCurrencyData.swapable ? 'Swapable' : 'Unswapable'}</span>
                                        </FormControl>
                                    </CardContent>
                                    <CardActions className="d-flex justify-right pt-0">
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                        <Button onClick={handleSaveNewCurrency} variant="contained">Save</Button>
                                    </CardActions>
                                </Card>
                                :
                                <Card sx={Config.customerModalStyle}>
                                    <CardContent>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField label="Currency Name" variant="outlined" value={editData?.currencyName} onChange={(e) => handleEditCurrencyData('currencyName', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Full Name" variant="outlined" value={editData?.fullName} onChange={(e) => handleEditCurrencyData('fullName', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Token" variant="outlined" value={editData?.token} onChange={(e) => handleEditCurrencyData('token', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Decimal" variant="outlined" value={editData?.decimal} onChange={(e) => handleEditCurrencyData('decimal', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={editData?.available}
                                                onChange={(e) => handleEditCurrencyData('available', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newCurrencyData.available ? 'Available' : 'Unavailable'}</span>
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={editData?.withdrawable}
                                                onChange={(e) => handleEditCurrencyData('withdrawable', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newCurrencyData.withdrawable ? 'Withdrawable' : 'Unwithdrawable'}</span>
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={editData?.swapable}
                                                onChange={(e) => handleEditCurrencyData('swapable', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newCurrencyData.swapable ? 'Swapable' : 'Unswapable'}</span>
                                        </FormControl>
                                    </CardContent>
                                    <CardActions className="d-flex justify-right pt-0">
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                        <Button onClick={handleEditCurrency} variant="contained">Save</Button>
                                    </CardActions>
                                </Card>
                        }

                    </Fade>
                </Box>
            </Modal>
        </Box>
    );
};

export default CurrencyManagement;