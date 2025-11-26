import { Modal, Box, IconButton, Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useState } from "react";
import { ReactComponent as CoinIcon } from "assets/icons/CoinIcon.svg";
import { useEffect } from "react";
import { getLevelData } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '105px',
        width: '700px',
        height: '800px',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        borderRadius: '30px',
        "@media (max-width: 681px)": {
            width: '100%',
            padding: '28px',
            borderRadius: '0px'
        }
    },
    ModalCloseButton: {
        position: 'absolute',
        top: '-32px',
        right: '-32px',
        width: '64px',
        height: '64px',
        color: '#55556F',
        background: '#2C2C3A',
        border: '6px solid #24252D',
        "&:hover": {
            background: '#2C2C3AEE'
        },
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            right: 'unset',
            left: '50%'
        }
    },
    ModalBodyBox: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'start',
        width: '100%',
        height: '100%',
        padding: '50px',
        flexDirection: 'column',
        "@media (max-width: 681px)": {
            padding: '10px 0px 0px 0px'
        }
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
    ModalTitleBox: {
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "31px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "&>p": {
            fontFamily: "'Styrene A Web'",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "18px",
            color: "#FFFFFF",
            opacity: 0.5
        }
    },
    ModalDataBox: {
        width: '100%',
        height: '100%',
        overflow: 'auto'
    },
    LevelHeader: {
        fontFamily: "'Cera Pro'",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "18px",
        color: "#FFFFFF",
        textTransform: 'uppercase'
    },
    LevelDataBox: {
        width: '100%',
        height: '50px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 12px',
        background: '#424253',
        marginTop: '8px'
    },
    LevelDataTitle: {
        fontFamily: "'Styrene A Web'",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'bottom',
        justifyContent: 'space-between',
        padding: '0px 10px'
    },
    LevelDetailBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: "'Styrene A Web'",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "18px",
        color: "#FFFFFF",
        "&>svg": {
            width: '16px',
            height: '16px'
        }
    },
    LevelText: {
        fontFamily: "'Cera Pro'",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        color: "#6FE482",
        textTransform: 'uppercase'
    }
}));

const LevelModal = ({ open, setOpen }) => {
    const classes = useStyles();

    const handleClose = () => setOpen(false);

    const [expanded, setExpanded] = useState(0);
    const [levelData, setLevelData] = useState([]);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, []);

    const initFunc = async () => {
        const response = await getLevelData();
        if (response.status) {
            setLevelData([...response.data]);
        }
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            slotProps={{ backdrop: { className: classes.backdrop } }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.ModalBox}>
                <IconButton className={classes.ModalCloseButton} onClick={handleClose}>
                    <Close />
                </IconButton>
                <Box className={classes.ModalBodyBox}>
                    <Box className={classes.ModalTitleBox}>
                        <span>Ranks and levels</span>
                        <p>Unlock exciting new levels and rewards as you track your progress with our innovative level up feature. As you use our app and earn points, you'll climb the ranks and unlock exclusive features along the way.</p>
                    </Box>
                    <Box className={clsx(classes.ModalDataBox, 'CustomScroll')}>
                        {
                            levelData.map((data, index) => {
                                return (
                                    <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore sx={{ color: '#FFF' }} />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.LevelHeader}>{data.label}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box className={classes.LevelDataTitle}>
                                                <span>Level</span>
                                                <span>Wargered</span>
                                            </Box>
                                            {
                                                data.data.map((level, key) => {
                                                    return (
                                                        <Box className={classes.LevelDataBox} key={key}>
                                                            <span className={classes.LevelText}>Level{index * 10 + key}</span>
                                                            <Box className={classes.LevelDetailBox}>
                                                                <CoinIcon />
                                                                <span>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(level)}</span>
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })
                        }
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

LevelModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default LevelModal;