import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import HistoryDice from "./HistoryDice";

const useStyles = makeStyles((props) => ({
    HistoryItem: {
        padding: '3px',
        border: 'solid 2px #FFF',
        display: 'flex',
        gap: '3px',
        // transform: (props) => `translate(-${props.index * 82}px)`,
        "@media (max-width: 681px)": {
            gap: '2px'
        }
    },
    LostItem: {
        borderColor: '#F00'
    }
}));

const HistoryItem = ({ countL, countR, win, index }) => {
    const classes = useStyles({index});

    return (
        <Box className={clsx(classes.HistoryItem, !win ? classes.LostItem : '', 'HistoryItem')}>
            <HistoryDice count={countL} />
            <HistoryDice count={countR} />
        </Box>
    );
};

export default HistoryItem;