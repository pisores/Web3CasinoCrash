import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    DiceContainer: {
        width: '32px',
        height: '32px',
        backgroundColor: '#9F60F1',
        position: 'relative',
        display: 'flex'
    },
    CircleItem: {
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: '#442F32',
        position: 'absolute'
    }
}));

const HistoryDice = ({ count }) => {
    const classes = useStyles();

    return (
        <Box className={clsx(classes.DiceContainer, `HistoryDiceContainer-${count}`)}>
            {
                new Array(count).fill(0).map((item, index) => (
                    <Box key={index} className={classes.CircleItem}></Box>
                ))
            }
        </Box>
    );
};

export default HistoryDice;