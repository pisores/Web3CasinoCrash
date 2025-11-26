import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState } from "react";
import AffiliateCampaigns from "./campaigns";
import AffiliateDashboard from "./dashboard";
import AffiliateUsers from "./users";

const useStyles = makeStyles(() => ({
    MainLayout: {
        width: '100%',
        paddingRight: 50,
        "@media (max-width: 940px)": {
            padding: '0px 10px',
        }
    },
    PageTitle: {
        color: "#FFFFFF",
        opacity: 0.5,
        fontSize: "32px",
        fontWeight: 900,
        lineHeight: "41px",
        fontFamily: "Styrene A Web",
        textShadow: "-8px 8px 0px rgba(0, 0, 0, 0.25)",
        textTransform: "uppercase"
    },
    PageStateBox: {
        width: '100%',
        padding: '13px 15px 13px 13px',
        backgroundColor: '#2C2C3A',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 26
    },
    PageStateButton: {
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 15,
        textTransform: 'uppercase',
        color: '#FFF',
        padding: '20px 0px',
        maxWidth: 347,
        width: '100%',
        borderRadius: 8,
        fontFamily: "Styrene A Web",
        maxHeight: 55
    },
    SelectedPageState: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)'
    }
}));

const AffiliateContainer = () => {
    const classes = useStyles();

    const [pageState, setPageState] = useState(0);

    const handlePageState = (state) => {
        setPageState(state);
    };

    return (
        <Box className={classes.MainLayout}>
            <Typography className={classes.PageTitle}>Affiliate</Typography>
            <Box className={classes.PageStateBox}>
                <Button onClick={() => handlePageState(0)} className={clsx(classes.PageStateButton, pageState === 0 ? classes.SelectedPageState : '')}>Dashboard</Button>
                <Button onClick={() => handlePageState(1)} className={clsx(classes.PageStateButton, pageState === 1 ? classes.SelectedPageState : '')}>Campaigns</Button>
                <Button onClick={() => handlePageState(2)} className={clsx(classes.PageStateButton, pageState === 2 ? classes.SelectedPageState : '')}>Users</Button>
            </Box>
            <Box className={classes.PageLayoutBox}>
                {
                    pageState === 0 ? <AffiliateDashboard /> :
                        pageState === 1 ? <AffiliateCampaigns /> :
                            <AffiliateUsers />
                }
            </Box>
        </Box>
    )
};

export default AffiliateContainer;