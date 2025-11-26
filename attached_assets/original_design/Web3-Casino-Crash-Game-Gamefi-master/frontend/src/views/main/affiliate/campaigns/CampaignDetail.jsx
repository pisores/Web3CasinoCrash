import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { getCampaignDetail } from "redux/actions/auth";
import EarnCard from "../cards/EarnCard";
import Tier1Card from "../cards/Tier1Card";
import Tier23Card from "../cards/Tier23Card";
import BonusCard from "../cards/BonusCard";
import PlayerTable from "../table/PlayerTable";
import Config from "config";
import { ReactComponent as ShareIcon } from "assets/icons/share.svg";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIcon.svg";
import UserChart from "../dashboard/UserChart";
import EarningChart from "../dashboard/EarningChart";

const useStyles = makeStyles(() => ({
    MainContainer: {
    },
    PrevButton: {
        gap: 5,
        color: '#FFF',
        height: 47,
        display: 'flex',
        padding: '14px 23px',
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        textTransform: 'uppercase',
        marginBottom: 20
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
}));

const CampaignDetailBox = ({
    handleList,
    campaignCode,
    campaignName
}) => {
    const classes = useStyles();
    const [campaignData, setCampaignData] = useState([]);

    const baseLink = `${Config.Root.baseUrl}/app/home?code=`;
    const [totalEarning, setTotalEarning] = useState(0);

    useEffect(() => {
        initFunc();
        // eslint-disable-next-line
    }, [campaignCode]);

    const initFunc = async () => {
        const response = await getCampaignDetail({ campaignCode });
        if (response.status) {
            setCampaignData([...response.data]);
        }
    };

    const handleCopyText = (text) => {
        window.navigator.clipboard.writeText(text);
    };

    return (
        <Box className={classes.MainContainer}>
            <Button onClick={handleList} className={classes.PrevButton}>
                <ArrowBack />
                {campaignName}
            </Button>
            <Box className={classes.CampaignLinkBox}>
                <Box className={classes.LinkSubBox}>
                    <Typography className={classes.LinkSubTitle}>Campaign link</Typography>
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
                    <Typography className={classes.LinkSubTitle}>Campaign code</Typography>
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
                            <UserChart type="custom" code={campaignCode} />
                        </Box>
                        <Box className={classes.CountBox}>
                            <p className={classes.TotalCountText}>Total: <span>{campaignData.length}</span></p>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.RegisteredSubBox}>
                    <Box className={classes.RegisteredTitleBox}>
                        <span className={classes.RegisterTitle}>Earnings</span>
                    </Box>
                    <Box className={classes.RegisterDataBox}>
                        <Box className={classes.DataBox}>
                            <EarningChart setTotalEarning={setTotalEarning} type="custom" code={campaignCode} />
                        </Box>
                        <Box className={classes.CountBox}>
                            <p className={classes.TotalCountText}>Total: <span>{totalEarning.toFixed(2)}</span></p>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.CardsBox}>
                <EarnCard userData={campaignData} />
                <Tier1Card userData={campaignData} />
                <Tier23Card />
                <BonusCard />
            </Box>
            <Box className={classes.PlayerTableBox}>
                <Typography className={classes.PlayerTableTitle}>Players</Typography>
                <PlayerTable userData={campaignData} />
            </Box>
        </Box>
    );
};

export default CampaignDetailBox;