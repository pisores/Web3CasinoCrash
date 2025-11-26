import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as ShareIcon } from "assets/icons/share.svg";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIcon.svg";
import { useEffect, useState } from "react";
import ClaimCard from "../cards/ClaimCard";
import EarnCard from "../cards/EarnCard";
import CommissionRateCard from "../cards/CommissionRateCard";
import Tier1Card from "../cards/Tier1Card";
import Tier23Card from "../cards/Tier23Card";
import BonusCard from "../cards/BonusCard";
import PlayerTable from "../table/PlayerTable";
import { useSelector } from "react-redux";
import { getCampaignCode, getCampaignData } from "redux/actions/auth";
import Config from "config";
import UserChart from "./UserChart";
import EarningChart from "./EarningChart";

const useStyles = makeStyles(() => ({
    MainLayout: {
        width: '100%',
        paddingTop: 18
    },
    CampaignLinkBox: {
        display: 'flex',
        gap: 28,
        alignItems: 'flex-end',
        "@media (max-width: 730px)": {
            flexDirection: 'column'
        }
    },
    LinkSubBox: {
        width: '100%'
    },
    LinkSubTitle: {
        fontWeight: 900,
        lineHeight: '18px',
        fontSize: 14,
        color: '#FFF',
        textShadow: '8px 8px 0px rgba(0, 0, 0, 0.25)',
        fontFamily: "Styrene A Web",
        marginBottom: 22
    },
    LinkTextBox: {
        background: '#424253',
        borderRadius: 7,
        width: '100%',
        height: 47,
        display: 'flex',
        alignItems: 'center',
        fontFamily: "Styrene A Web",
        justifyContent: 'space-between'
    },
    ShareLinkBox: {
        width: 72,
        height: 47,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '7px 0px 0px 7px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    LinkText: {
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        fontWeight: 400,
        width: '100%',
        fontFamily: "Styrene A Web",
        textAlign: 'center'
    },
    CopyButton: {
        marginRight: 14
    },
    RegisteredBox: {
        display: 'flex',
        gap: 29,
        marginTop: 41,
        "@media (max-width: 1100px)": {
            flexDirection: 'column'
        }
    },
    RegisteredSubBox: {
        width: '100%'
    },
    RegisterTitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 28,
        lineHeight: '32px',
        textTransform: 'uppercase',
        fontFamily: 'Styrene A Web',
        fontWeight: 900,
        "@media (max-width: 1100px)": {
            fontSize: 18,
            lineHeight: '22px'
        }
    },
    RegisterDataBox: {
        width: '100%',
        height: 344,
        border: 'solid 1px #363646',
        borderRadius: 8,
        marginTop: 34,
        "@media (max-width: 1100px)": {
            marginTop: 16,
            height: 250
        }
    },
    DataBox: {
        backgroundColor: '#2C2C3A',
        backgroundImage: 'url("/assets/images/affiliatebg.png")',
        backgroundSize: 'contain',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        height: 294,
        borderRadius: '8px 8px 0px 0px'
    },
    EmptyText: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Styrene A Web',
        fontSize: 16,
        lineHeight: '20px',
        textTransform: 'uppercase',
        color: '#FFF',
        fontWeight: 700
    },
    CountBox: {
        width: '100%',
        height: 50
    },
    TotalCountText: {
        fontFamily: 'Styrene A Web',
        fontSize: 16,
        lineHeight: '20px',
        textTransform: 'uppercase',
        color: '#FFF',
        fontWeight: 700,
        textAlign: 'center',
        "&>span": {
            color: '#6FE482'
        }
    },
    CardsBox: {
        width: '100%',
        gap: 27,
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        marginTop: 55,
        "@media (max-width: 1304px)": {
            gridTemplateColumns: 'auto auto'
        },
        "@media (max-width: 999px)": {
            gridTemplateColumns: 'auto'
        }
    },
    PlayerTableBox: {
        marginTop: 65
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

const AffiliateDashboard = () => {
    const classes = useStyles();
    const authData = useSelector((state) => state.authentication);

    const baseLink = `${Config.Root.baseUrl}/app/home?code=`;
    const [campaignCode, setCampaignCode] = useState('');

    const [userData, setUserData] = useState([]);
    const [totalEarning, setTotalEarning] = useState(0);

    useEffect(() => {
        if (authData.isAuth) {
            initFunc();
        }
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const initFunc = async () => {
        const request = { userId: authData.userData._id, type: 'default' };
        const response = await getCampaignCode(request);
        if (response.status) {
            setCampaignCode(response.data.code);
        }

        const campaignData = await getCampaignData(request);
        if (campaignData.status) {
            setUserData(campaignData.data);
        }
    };

    const handleCopyText = (text) => {
        window.navigator.clipboard.writeText(text);
    }

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.CampaignLinkBox}>
                <Box className={classes.LinkSubBox}>
                    <Typography className={classes.LinkSubTitle}>Default campaign link</Typography>
                    <Box className={classes.LinkTextBox}>
                        <Box className={classes.ShareLinkBox}>
                            <ShareIcon />
                        </Box>
                        <Typography className={classes.LinkText}>{baseLink + campaignCode}</Typography>
                        <IconButton className={classes.CopyButton} onClick={() => handleCopyText(baseLink + campaignCode)}>
                            <CopyIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box className={classes.LinkSubBox}>
                    <Typography className={classes.LinkSubTitle}>Default campaign code</Typography>
                    <Box className={classes.LinkTextBox}>
                        <Box className={classes.ShareLinkBox}>
                            <ShareIcon />
                        </Box>
                        <Typography className={classes.LinkText}>{campaignCode}</Typography>
                        <IconButton className={classes.CopyButton} onClick={() => handleCopyText(campaignCode)}>
                            <CopyIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.RegisteredBox}>
                <Box className={classes.RegisteredSubBox}>
                    <Box className={classes.RegisteredTitleBox}>
                        <span className={classes.RegisterTitle}>Registered users</span>
                    </Box>
                    <Box className={classes.RegisterDataBox}>
                        <Box className={classes.DataBox}>
                            <UserChart />
                        </Box>
                        <Box className={classes.CountBox}>
                            <p className={classes.TotalCountText}>Total: <span>{userData.length}</span></p>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.RegisteredSubBox}>
                    <Box className={classes.RegisteredTitleBox}>
                        <span className={classes.RegisterTitle}>Earnings</span>
                    </Box>
                    <Box className={classes.RegisterDataBox}>
                        <Box className={classes.DataBox}>
                            <EarningChart setTotalEarning={setTotalEarning} />
                        </Box>
                        <Box className={classes.CountBox}>
                            <p className={classes.TotalCountText}>Total: <span>{totalEarning.toFixed(2)}</span></p>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.CardsBox}>
                <ClaimCard userData={userData} initFunc={initFunc} />
                <EarnCard userData={userData} />
                <CommissionRateCard />
                <Tier1Card userData={userData} />
                <Tier23Card />
                <BonusCard />
            </Box>
            <Box className={classes.PlayerTableBox}>
                <Typography className={classes.PlayerTableTitle}>Players</Typography>
                <PlayerTable userData={userData} />
            </Box>
        </Box>
    );
};

export default AffiliateDashboard;