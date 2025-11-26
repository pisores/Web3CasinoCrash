import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    DiceContainer: {
        width: '90px',
        height: '90px',
        backgroundImage: 'url("/assets/images/dice/DiceR.png")',
        backgroundSize: '100% 100%',
        position: 'relative',
        display: 'flex',
        "@media (max-width: 681px)": {
            width: '70px',
            height: '70px'
        }
    },
    CircleItem: {
        width: '13px',
        height: '13px',
        borderRadius: '50%',
        backgroundColor: '#FFF',
        position: 'absolute',
        "@media (max-width: 681px)": {
            width: '11px',
            height: '11px'
        }
    }
}));

const DiceR = ({ count }) => {
    const classes = useStyles();

    return (
        <Box className={clsx(classes.DiceContainer, `DiceContainer-${count}`, 'DiceRBox')}>
            {
                new Array(count).fill(0).map((item, index) => (
                    <Box key={index} className={classes.CircleItem}></Box>
                ))
            }
        </Box>
    );
};

export default DiceR;