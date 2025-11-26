import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Outlet } from "react-router";
import HelpSearch from "../HelpSearch";

const useStyles = makeStyles(() => ({
    HelpLayout: {
        width: '100%',
        paddingRight: 50,
        "@media (max-width: 940px)": {
            padding: '0px 10px'
        }
    }
}));

const HelpLayout = () => {
    const classes = useStyles();

    return (
        <Box className={classes.HelpLayout}>
            <HelpSearch />
            <Outlet />
        </Box>
    );
};

export default HelpLayout;