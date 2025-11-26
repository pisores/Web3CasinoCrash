import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
    CustomButtonBox: {
        width: '100%',
        height: '55px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#FFF',
        color: '#211E1E',
        marginBottom: '10px',
        fontWeight: '700',
        fontSize: '16px',
        fontFamily: "'Styrene A Web'",
        cursor: 'pointer',
        textTransform: 'uppercase',
        "&>span": {
            opacity: '0.8'
        }
    },
    CustomButtonIcon: {
        position: 'absolute',
        left: '10px',
        width: '30px',
        height: '30px'
    }
}));

const CustomButton = ({ customStyle, Icon, Text, onClick }) => {
    const classes = useStyles();

    return (
        <Box className={clsx(customStyle, classes.CustomButtonBox)} onClick={onClick}>
            <Icon className={classes.CustomButtonIcon} />
            <span>{Text}</span>
        </Box>
    );
};

export default CustomButton;