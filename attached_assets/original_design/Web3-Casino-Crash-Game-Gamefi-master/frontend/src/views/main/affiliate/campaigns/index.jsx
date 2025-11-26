import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CampaignTable from "../table/CampaignTable";
import CampaignDetailBox from "./CampaignDetail";
import { useState } from "react";

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

const PAGE_TYPE = {
    LIST: 0,
    DETAIL: 1
};

const AffiliateCampaigns = () => {
    const classes = useStyles();

    const [pageType, setPageType] = useState(PAGE_TYPE.LIST);
    const [detailCode, setDetailCode] = useState('');
    const [detailName, setDetailName] = useState('');

    const handleDetail = (campaignCode, campaignName) => {
        setPageType(PAGE_TYPE.DETAIL);
        setDetailCode(campaignCode);
        setDetailName(campaignName);
    };

    const handleList = () => {
        setPageType(PAGE_TYPE.LIST);
    };

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.PlayerTableBox}>
                <Typography className={classes.PlayerTableTitle}>Campaigns</Typography>
                {
                    pageType === PAGE_TYPE.LIST &&
                    <CampaignTable
                        handleDetail={handleDetail}
                    />
                }
                {
                    pageType === PAGE_TYPE.DETAIL &&
                    <CampaignDetailBox
                        handleList={handleList}
                        campaignCode={detailCode}
                        campaignName={detailName}
                    />
                }
            </Box>
        </Box>
    );
};

export default AffiliateCampaigns;