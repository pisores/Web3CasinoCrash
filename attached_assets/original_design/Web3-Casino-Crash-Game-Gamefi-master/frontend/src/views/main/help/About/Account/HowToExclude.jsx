import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HelpTree from "../../HelpTree";

const useStyles = makeStyles(() => ({
    MainLayout: {
        width: '100%',
        padding: '12px'
    },
    HelpTreeBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    PageTitle: {
        fontFamily: 'Styrene A Web',
        fontWeight: 900,
        fontSize: 28,
        lineHeight: '32px',
        textTransform: 'uppercase',
        color: '#FFF'
    },
    DetailBox: {
        marginTop: 21,
        marginBottom: 30
    },
    PageGroupTitle: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        marginTop: 30,
        marginBottom: 14
    },
    DataLine: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        marginBottom: 40
    },
    DataIndex: {
        width: 41,
        height: 41,
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: '50%',
        fontFamily: 'Styrene A Web',
        fontSize: 20,
        fontWeight: 400,
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
    },
    DataText: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFF',
        fontFamily: 'Styrene A Web'
    },
    WarningBox: {
        background: '#2C2C3A',
        borderRadius: 7,
        padding: '20px 34px',
        fontFamily: 'Styrene A Web',
        color: '#F2494C',
        fontSize: 18,
        fontWeight: 400,
        marginTop: 20
    }
}));

const HowToExclude = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/about', label: 'About' }
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>HOW CAN I SELF EXCLUDE FROM THE GAME?</Typography>
                <Typography className={classes.PageGroupTitle}>If you want to take a break from playing, go to your profile and select the Self Exclusion option from the menu. A window will pop up describing the first stage of self-exclusion.</Typography>
                <Typography className={classes.PageGroupTitle}>Once you click on Cool Off, you won’t be able to bet for 24hrs.</Typography>
                <Typography className={classes.PageGroupTitle}>After the first 24hrs pass, you can extend the self-exclusion period if you wish to. You will be able to withdraw money while you are self-excluded for 24hrs, a week, or a month but not if you choose to be excluded permanently.</Typography>
                <Typography className={classes.PageGroupTitle}>Please make sure you want to be excluded from the game for the period you select.</Typography>
                <Typography className={classes.PageGroupTitle}>If you are permanently self-excluded from the game and forgot to withdraw your funds, contact support@memewarsx.com for help.</Typography>
            </Box>
        </Box>
    );
};

export default HowToExclude;