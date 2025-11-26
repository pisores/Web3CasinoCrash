import { Box, Button, Card, CardActions, CardContent, Fade, FormControl, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import Config from "config/index";
import { useToasts } from "react-toast-notifications";
import { LoadingContext } from "layout/Context/loading";
import { Delete, Edit } from "@mui/icons-material";
import { confirmAlert } from "react-confirm-alert";
import { addNewTournament, deleteTournament, getTournamentList, updateTournament } from "redux/action/auth";

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
    { value: 'name', label: 'Name', ischeck: true },
    { value: 'prize', label: 'Prize', ischeck: true },
    { value: 'startDate', label: 'Start Date', ischeck: true },
    { value: 'endDate', label: 'End Date', ischeck: true },
    { value: 'users', label: 'Users', ischeck: true },
    { value: 'finished', label: 'Finished', ischeck: true },
    { value: 'edit', label: 'Edit', ischeck: true },
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

const formatDate = (date) => {
    const day = String(new Date(date).getDate()).padStart(2, "0");
    const month = String(new Date(date).getMonth() + 1).padStart(2, "0");
    const year = new Date(date).getFullYear();
    const dateString = `${year}-${month}-${day}`;
    return dateString;
}

const TournamentList = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(0);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const [newTournamentData, setNewTournamentData] = useState({
        name: '',
        description: '',
        prizePoolAmount: 0,
        prizePoolCoinType: 'ZELO',
        winnerPercent1: 0,
        winnerPercent2: 0,
        winnerPercent3: 0,
        winnerPercentN: 0,
        startDate: formatDate(new Date()),
        endDate: formatDate(new Date()),
        finished: false,
        priceAmount: 100
    });
    const [editData, setEditData] = useState({});

    const [tournamentList, setTournamentList] = useState([
    ]);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await getTournamentList();
        if (response.status) {
            setTournamentList(response.data);
        }
        hideLoading();
    };

    const handleRequestSort = (property) => {
        let tempProperty = property;
        const isAsc = orderBy === tempProperty && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(tempProperty);
    };

    const handleNewTournament = () => {
        setModalType(0);
        handleModalOpen();
    }

    const handleEdit = (data) => {
        setEditData(data);
        setModalType(1);
        handleModalOpen();
    }

    const handleDeleteTournament = async (id) => {
        confirmAlert({
            title: '',
            message: 'Do you really want to remove this tournament?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        showLoading();
                        const response = await deleteTournament({ id });
                        if (response.status) {
                            addToast('This tournament successfully removed!', { appearance: 'success', autoDismiss: true });
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
    }

    const handleNewTournamentData = (key, value) => {
        let tournamentData = { ...newTournamentData };
        tournamentData[key] = value;
        if (key === 'winnerPercent1' || key === 'winnerPercent2' || key === 'winnerPercent3') {
            tournamentData.winnerPercentN = 100 - tournamentData.winnerPercent1 - tournamentData.winnerPercent2 - tournamentData.winnerPercent3;
        }
        setNewTournamentData({ ...tournamentData });
    }

    const handleSaveNewTournament = async () => {
        showLoading();
        if (validateSaveData(newTournamentData)) {
            const response = await addNewTournament(newTournamentData);
            if (response.status) {
                addToast('Successfully saved!', { appearance: 'success', autoDismiss: true });
                handleModalClose();
                initFunc();
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
        hideLoading();
    }

    const validateSaveData = (data) => {
        if (new Date(data.startDate).getTime() <= new Date().getTime()) {
            addToast('Start date should be great than today!', { appearance: 'error', autoDismiss: true });
            return false;
        }
        else if (new Date(data.startDate).getTime() >= new Date(data.endDate).getTime()) {
            addToast('End date should be great than start date!', { appearance: 'error', autoDismiss: true });
            return false;
        }
        else if (data.name === '') {
            addToast('Please input tournament name!', { appearance: 'error', autoDismiss: true });
            return false;
        }
        else if (data.description === '') {
            addToast('Please input tournament description!', { appearance: 'error', autoDismiss: true });
            return false;
        }
        else if (data.prizePoolAmount <= 0) {
            addToast('Please input correct prize pool amount!', { appearance: 'error', autoDismiss: true });
            return false;
        }
        else if (data.winnerPercentN === 100) {
            addToast('Please input winner percent!', { appearance: 'error', autoDismiss: true });
            return false;
        }
        return true;
    }

    const handleEditTournamentData = (key, value) => {
        let tournamentData = { ...editData };
        tournamentData[key] = value;
        if (key === 'winnerPercent1' || key === 'winnerPercent2' || key === 'winnerPercent3') {
            tournamentData.winnerPercentN = 100 - tournamentData.winnerPercent1 - tournamentData.winnerPercent2 - tournamentData.winnerPercent3;
        }
        setEditData({ ...tournamentData });
    }

    const handleEditTournament = async () => {
        showLoading();
        if (validateSaveData(editData)) {
            const response = await updateTournament(editData);
            if (response.status) {
                addToast('Successfully saved!', { appearance: 'success', autoDismiss: true });
                handleModalClose();
                initFunc();
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
        hideLoading();
    }

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.PageTitleBox}>
                <span>Tournament List</span>
                <Button variant="contained" onClick={handleNewTournament}>Add New Tournament</Button>
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
                            tournamentList?.map((item, index) => (
                                <TableRow key={item._id} className={classes.TableRow}>
                                    <TableCell>
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        {item.prizePoolAmount}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.startDate))}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.endDate))}
                                    </TableCell>
                                    <TableCell>
                                        {item?.users?.length}
                                    </TableCell>
                                    <TableCell>
                                        {item.finished ? 'Finished' : 'Pending'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(item)}><Edit /></IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteTournament(item._id)}><Delete /></IconButton>
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
                                            <TextField label="Name" variant="outlined" value={newTournamentData.name} onChange={(e) => handleNewTournamentData('name', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Description" variant="outlined" value={newTournamentData.description} onChange={(e) => handleNewTournamentData('description', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize Pool" variant="outlined" value={newTournamentData.prizePoolAmount} onChange={(e) => handleNewTournamentData('prizePoolAmount', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize percent of 1st winner" variant="outlined" value={newTournamentData.winnerPercent1} onChange={(e) => handleNewTournamentData('winnerPercent1', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize percent of 2nd winner" variant="outlined" value={newTournamentData.winnerPercent2} onChange={(e) => handleNewTournamentData('winnerPercent2', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize percent of 3rd winner" variant="outlined" value={newTournamentData.winnerPercent3} onChange={(e) => handleNewTournamentData('winnerPercent3', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField ltype="number" disabled label="Prize percent of other winners" variant="outlined" value={newTournamentData.winnerPercentN} onChange={(e) => handleNewTournamentData('winnerPercentN', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="date" label="Start Date" variant="outlined" value={newTournamentData.startDate} onChange={(e) => handleNewTournamentData('startDate', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="date" label="End Date" variant="outlined" value={newTournamentData.endDate} onChange={(e) => handleNewTournamentData('endDate', e.target.value)} />
                                        </FormControl>
                                    </CardContent>
                                    <CardActions className="d-flex justify-right pt-0">
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                        <Button onClick={handleSaveNewTournament} variant="contained">Save</Button>
                                    </CardActions>
                                </Card>
                                :
                                <Card sx={Config.customerModalStyle}>
                                    <CardContent>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField label="Name" variant="outlined" value={editData.name} onChange={(e) => handleEditTournamentData('name', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Description" variant="outlined" value={editData.description} onChange={(e) => handleEditTournamentData('description', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize Pool" variant="outlined" value={editData.prizePoolAmount} onChange={(e) => handleEditTournamentData('prizePoolAmount', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize percent of 1st winner" variant="outlined" value={editData.winnerPercent1} onChange={(e) => handleEditTournamentData('winnerPercent1', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize percent of 2nd winner" variant="outlined" value={editData.winnerPercent2} onChange={(e) => handleEditTournamentData('winnerPercent2', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="number" label="Prize percent of 3rd winner" variant="outlined" value={editData.winnerPercent3} onChange={(e) => handleEditTournamentData('winnerPercent3', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField ltype="number" disabled label="Prize percent of other winners" variant="outlined" value={editData.winnerPercentN} onChange={(e) => handleEditTournamentData('winnerPercentN', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="date" label="Start Date" variant="outlined" value={formatDate(editData.startDate)} onChange={(e) => handleEditTournamentData('startDate', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField type="date" label="End Date" variant="outlined" value={formatDate(editData.endDate)} onChange={(e) => handleEditTournamentData('endDate', e.target.value)} />
                                        </FormControl>
                                    </CardContent>
                                    <CardActions className="d-flex justify-right pt-0">
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                        <Button onClick={handleEditTournament} variant="contained">Save</Button>
                                    </CardActions>
                                </Card>
                        }

                    </Fade>
                </Box>
            </Modal>
        </Box>
    );
};

export default TournamentList;