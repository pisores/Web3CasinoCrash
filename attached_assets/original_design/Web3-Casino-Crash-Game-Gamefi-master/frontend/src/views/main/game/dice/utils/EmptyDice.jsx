import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    DiceContainer: {
        width: '32px',
        height: '32px',
        backgroundColor: '#565666',
        position: 'relative',
        display: 'flex',
        "@media (max-width: 681px)": {
            width: '26px',
            height: '26px'
        }
    },
    CircleItem: {
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: '#442F32',
        position: 'absolute'
    }
}));

const EmptyDice = ({ count }) => {
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

export default EmptyDice;