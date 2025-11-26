import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import EmptyDice from "./EmptyDice";

const useStyles = makeStyles(() => ({
    HistoryItem: {
        padding: '3px',
        border: 'solid 2px #565666',
        display: 'flex',
        gap: '3px'
    }
}));

const EmptyItem = ({ countL, countR, }) => {
    const classes = useStyles();

    return (
        <Box className={clsx(classes.HistoryItem)}>
            <EmptyDice count={countL} />
            <EmptyDice count={countR} />
        </Box>
    );
};

export default EmptyItem;