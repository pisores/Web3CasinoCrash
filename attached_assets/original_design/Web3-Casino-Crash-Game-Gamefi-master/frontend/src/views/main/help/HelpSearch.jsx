import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

const useStyles = makeStyles(() => ({
    MainLayout: {
        width: '100%'
    },
    SearchBox: {
        maxWidth: '576px',
        height: '40px',
        width: '100%',
        position: 'relative',
        margin: 'auto',
        marginTop: '20px',
        "&>svg": {
            position: 'absolute',
            right: '20px',
            top: '10px'
        }
    },
    SearchInput: {
        border: 'none',
        background: '#424253',
        color: '#FFF',
        borderRadius: '8px',
        outline: 'none',
        width: '100%',
        height: '100%',
        fontSize: '14px',
        fontFamily: 'Styrene A Web',
        paddingLeft: '16px',
        paddingRight: '50px',
        "&::placeholder": {
            color: 'inherit'
        }
    },
    SearchTitle: {
        fontFamily: 'Styrene A Web',
        fontSize: 28,
        lineHeight: '36px',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 900,
        textAlign: 'center'
    }
}));

const HelpSearch = () => {
    const classes = useStyles();

    return (
        <Box className={classes.MainLayout}>
            <Typography className={classes.SearchTitle}>Hi! How can we help?</Typography>
            <Box className={classes.SearchBox}>
                <input className={classes.SearchInput} placeholder="Search" />
                <SearchIcon />
            </Box>
        </Box>
    );
};

export default HelpSearch;