import { Box, Button, Card, CardActions, CardContent, Checkbox, Fade, FormControl, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useState } from "react";
import Config from "config/index";
import { insertGame, readGame, removeGame, updateGame } from "redux/action/game";
import { useToasts } from "react-toast-notifications";
import { LoadingContext } from "layout/Context/loading";
import { Delete, Edit, Launch } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

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
    { value: 'gameName', label: 'Game Name', ischeck: true },
    { value: 'regDate', label: 'Registered Date', ischeck: true },
    { value: 'edit', label: 'Edit', ischeck: true },
    { value: 'goto', label: 'Go To', ischeck: true },
    { value: 'delete', label: 'Delete', ischeck: true },
    { value: 'available', label: 'Available', ischeck: true },
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

const GameList = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(0);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const [newGameData, setNewGameData] = useState({
        gameName: '',
        gameLink: '',
        available: true,
    });
    const [editData, setEditData] = useState({});

    const [gameList, setGameList] = useState([
    ]);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        showLoading();
        const response = await readGame();
        if (response.status) {
            setGameList(response.data);
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

    const handleNewGame = () => {
        setModalType(0);
        handleModalOpen();
    };

    const handleNewGameData = (key, value) => {
        let data = newGameData;
        data[key] = value;
        setNewGameData({ ...data });
    };

    const handleEditGameData = (key, value) => {
        let data = editData;
        data[key] = value;
        setEditData({ ...data });
    }

    const handleSaveNewGame = async () => {
        showLoading();
        const response = await insertGame(newGameData);
        if (response.status) {
            addToast('Successfully Saved!', { appearance: 'success', autoDismiss: true });
            setNewGameData({
                gameName: '',
                gameLink: '',
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

    const handleDeleteGame = async (id) => {
        confirmAlert({
            title: '',
            message: 'Do you really want to remove this game?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        showLoading();
                        const response = await removeGame({ gameId: id });
                        if (response.status) {
                            addToast('This game successfully removed!', { appearance: 'success', autoDismiss: true });
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

    const handleEditGame = async () => {
        showLoading();
        const response = await updateGame(editData);
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
                <span>Game List</span>
                <Button variant="contained" onClick={handleNewGame}>Add New Game</Button>
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
                            gameList?.map((item, index) => (
                                <TableRow key={item._id} className={classes.TableRow}>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {item.gameName}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.regDate))}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(item)}><Edit /></IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/games/${item.gameLink}`} target="_blank">
                                            <IconButton><Launch /></IconButton>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteGame(item._id)}><Delete /></IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <AvailableRect available={item.available} />
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
                                            <TextField label="Game Name" variant="outlined" value={newGameData.gameName} onChange={(e) => handleNewGameData('gameName', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Game Link" variant="outlined" value={newGameData.gameLink} onChange={(e) => handleNewGameData('gameLink', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={newGameData.available}
                                                onChange={(e) => handleNewGameData('available', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newGameData.available ? 'Available' : 'Unavailable'}</span>
                                        </FormControl>
                                    </CardContent>
                                    <CardActions className="d-flex justify-right pt-0">
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                        <Button onClick={handleSaveNewGame} variant="contained">Save</Button>
                                    </CardActions>
                                </Card>
                                :
                                <Card sx={Config.customerModalStyle}>
                                    <CardContent>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField label="Game Name" variant="outlined" value={editData?.gameName} onChange={(e) => handleEditGameData('gameName', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                            <TextField label="Game Link" variant="outlined" value={editData?.gameLink} onChange={(e) => handleEditGameData('gameLink', e.target.value)} />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth className={classes.AvailabelBox} sx={{ mt: 1 }}>
                                            <Checkbox
                                                checked={editData?.available}
                                                onChange={(e) => handleEditGameData('available', e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            <span>{newGameData.available ? 'Available' : 'Unavailable'}</span>
                                        </FormControl>
                                    </CardContent>
                                    <CardActions className="d-flex justify-right pt-0">
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                        <Button onClick={handleEditGame} variant="contained">Save</Button>
                                    </CardActions>
                                </Card>
                        }

                    </Fade>
                </Box>
            </Modal>
        </Box>
    );
};

export default GameList;