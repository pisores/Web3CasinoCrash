import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState } from "react";
// import { useSelector } from "react-redux";
import DataTable from "views/components/datatable";

const useStyles = makeStyles(() => ({
    HistoryBoxContainer: {
        width: '100%',
        marginBottom: '20px'
    },
    HistoryTabBox: {
        display: 'flex',
        // borderBottom: '1px solid #432b88',
        padding: '0px 40px',
        '-webkit-box-pack': 'unset',
        justifyContent: 'unset'
    },
    TabButton: {
        fontSize: '16px',
        lineHeight: '24px',
        padding: '36px 0px 8px',
        marginLeft: '36px',
        color: '#9893cb',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    TabButtonActive: {
        color: '#f0ecff',
        borderBottom: '2px solid #f0ecff',
        borderRadius: '4px 4px 0 0'
    },
    HistoryDataBox: {
        width: '100%',
        minHeight: '750px'
    },
    HistoryTable: {
        width: '100%'
    },
    HistoryTableHeader: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
        padding: '24px 40px 8px',
        color: '#9893cb',
        zIndex: '10'
    },
    HistoryTableBody: {
        padding: '12px 24px',
        color: '#9893cb',
        textAlign: 'center'
    },
    HistoryStateBox: {
        border: '1px solid #363646',
        borderRadius: '8px',
        width: '352px',
        marginBottom: '20px',
        "@media (max-width: 830px)": {
            width: '100%',
        },
        "@media (max-width: 681px)": {
            borderRadius: '0px'
        }
    },
    HistoryTabButton: {
        width: '175px',
        height: '47px',
        borderRadius: '8px',
        color: '#FFF',
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: '700',
        lineHeight: '18px',
        fontFamily: 'Styrene A Web',
        padding: '0px',
        "@media (max-width: 830px)": {
            width: '33%',
        },
        "@media (max-width: 681px)": {
            borderRadius: '0px'
        }
    },
    SelectedButton: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)'
    }
}));

const HistoryBox = () => {
    const classes = useStyles();
    const [tabState, setTabState] = useState(0);

    return (
        <Box className={classes.HistoryBoxContainer}>
            <Box className={classes.HistoryStateBox}>
                <Button className={clsx(classes.HistoryTabButton, tabState === 0 ? classes.SelectedButton : '')} onClick={() => setTabState(0)}>My Bets</Button>
                <Button className={clsx(classes.HistoryTabButton, tabState === 1 ? classes.SelectedButton : '')} onClick={() => setTabState(1)}>All Bets</Button>
            </Box>
            <Box className={classes.HistoryDataBox}>
                <DataTable gameType="turtle" historyState={tabState} />
            </Box>
        </Box>
    );
};

export default HistoryBox;