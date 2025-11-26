import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PlayerTable from "../table/PlayerTable";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCampaignData } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    MainLayout: {
        width: '100%',
        paddingTop: 18
    },
    PlayerTableBox: {
        marginTop: 55
    },
    PlayerTableTitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        textShadow: '-8px 8px 0px rgba(0, 0, 0, 0.25)',
        textTransform: 'uppercase',
        fontWeight: 900,
        fontSize: 28,
        lineHeight: '32px',
        marginBottom: 27
    }
}));

const AffiliateUsers = () => {
    const classes = useStyles();
    const authData = useSelector((state) => state.authentication);

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (authData.isAuth) {
            initFunc();
        }
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const initFunc = async () => {
        const request = { userId: authData.userData._id, type: 'default' };
        const campaignData = await getCampaignData(request);
        if (campaignData.status) {
            setUserData(campaignData.data);
        }
    };

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.PlayerTableBox}>
                <Typography className={classes.PlayerTableTitle}>Users</Typography>
                <PlayerTable userData={userData} />
            </Box>
        </Box>
    );
};

export default AffiliateUsers;