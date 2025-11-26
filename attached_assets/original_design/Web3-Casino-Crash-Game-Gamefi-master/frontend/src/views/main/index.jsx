import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    RootContainer: {
        width: '100%',
        height: '100%'
    }
}));

const MainBody = () => {
    const classes = useStyles();
    
    return (
        <Box className={classes.RootContainer}></Box>
    );
};

export default MainBody;