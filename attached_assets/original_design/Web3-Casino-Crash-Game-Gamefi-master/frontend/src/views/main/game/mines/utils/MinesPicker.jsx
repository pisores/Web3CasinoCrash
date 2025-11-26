import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    CountPickerBox: {
        width: "218px",
        height: "249px",
        padding: "15px",
        position: "absolute",
        zIndex: 1,
        background: "#1F1F26",
        border: "solid 2px #8055E4",
        top: "-261px",
        right: "0px",
        boxShadow: "rgb(33 44 52 / 20%) 0px 2px 10px 0px",
        "&>h1": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "15px",
            lineHeight: "19px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: '0px',
            marginBottom: '13px'
        }
    },
    GridBox: {
        display: 'grid',
        gridTemplateColumns: '30px 30px 30px 30px 30px',
        gap: '10px'
    },
    GridOption: {
        height: "30px",
        width: "30px",
        display: "flex",
        WebkitBoxAlign: "center",
        alignItems: "center",
        WebkitBoxPack: "center",
        justifyContent: "center",
        background: "rgb(52, 67, 77)",
        borderRadius: "50%",
        transition: "color 300ms ease 0s",
        cursor: "pointer",
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    SelectedOption: {
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)"
    }
}));

const MinesPicker = ({ minMinesCount, maxMinesCount, minesCount, setMinesCount }) => {
    const classes = useStyles();
    const virtualArray = new Array(maxMinesCount - minMinesCount + 1).fill(0);

    const handleMinesCount = (count) => {
        setMinesCount(count);
    }

    return (
        <Box className={classes.CountPickerBox}>
            <h1>Number of Mines</h1>
            <Box className={classes.GridBox}>
                {
                    virtualArray.map((item, index) => {
                        const curIndex = minMinesCount + index;
                        return (
                            <Box
                                key={index}
                                onClick={() => handleMinesCount(curIndex)}
                                className={clsx(classes.GridOption, minesCount === curIndex ? classes.SelectedOption : '')}>
                                {curIndex}
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    );
};

export default MinesPicker;