import { Box, Table, TableHead, TableRow, TableSortLabel, TableCell, TableBody, Button, Modal, Fade, CardContent, FormControl, InputAdornment, IconButton, CardActions, Card, OutlinedInput } from "@mui/material";
import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useDispatch } from "react-redux";
import { getSeedData, newServerSeed } from "redux/action/report";
import { useToasts } from 'react-toast-notifications';
import { CopyAll } from "@mui/icons-material";
import Config from "config/index";

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
    NewSeed: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}));

const headCells = [
    { value: 'id', label: 'ID', ischeck: true },
    { value: 'seed', label: 'Seed', ischeck: true },
    { value: 'seedType', label: 'Seed Type', ischeck: true },
    { value: 'date', label: 'Date', ischeck: true },
    { value: 'userId', label: 'User ID', ischeck: true },
    { value: 'userName', label: 'User Name', ischeck: true }
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

const generateSeed = (length = 20) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const FairManagement = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [data, setData] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [newSeed, setNewSeed] = useState('');
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    useEffect(() => {
        init()
        // eslint-disable-next-line
    }, [dispatch]);

    const init = async () => {
        showLoading();
        const response = await getSeedData();
        if (response.status) {
            setData(response.data);
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

    const handleCopyText = (text) => {
        window.navigator.clipboard.writeText(text);
    };

    const handleSave = async () => {
        showLoading();
        const response = await newServerSeed({ seed: newSeed });
        if (response.status) {
            addToast('Server seed updated!', { appearance: 'success', autoDismiss: true });
            init();
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        handleModalClose();
        hideLoading();
    }

    const handleRandomSeed = () => {
        const seed = generateSeed();
        setNewSeed(seed);
    }

    return (
        <Box className={classes.PlayerContainer}>
            <Box className={classes.TableTitleBox}>
                <span>Fair System</span>
                <Button variant="contained" onClick={handleModalOpen}>Generate New Seed</Button>
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
                                        {item.seed}
                                    </TableCell>
                                    <TableCell>
                                        {item.type}
                                    </TableCell>
                                    <TableCell>
                                        {item.date}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.type === 'client' &&
                                            item.userData._id
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.type === 'client' &&
                                            item.userData.userNickName
                                        }
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
                        <Card sx={Config.customerModalStyle}>
                            <CardContent>
                                <FormControl variant="standard" fullWidth className={classes.NewSeed}>
                                    <OutlinedInput
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => handleCopyText(newSeed)}>
                                                    <CopyAll />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        onChange={(e) => setNewSeed(e.target.value)}
                                        style={{ width: '80%' }}
                                        value={newSeed}
                                    />
                                    <Button variant="contained" color="secondary" onClick={handleRandomSeed}>Random</Button>
                                </FormControl>
                            </CardContent>
                            <CardActions className="d-flex justify-right pt-0">
                                <Button onClick={handleModalClose}>Cancel</Button>
                                <Button onClick={handleSave} variant="contained">Save</Button>
                            </CardActions>
                        </Card>
                    </Fade>
                </Box>
            </Modal>
        </Box>
    );
};

export default FairManagement;