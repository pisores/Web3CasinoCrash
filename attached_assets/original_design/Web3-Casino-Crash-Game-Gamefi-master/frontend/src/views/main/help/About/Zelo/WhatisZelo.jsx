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
        marginTop: 20,
        marginBottom: 20
    }
}));

const WhatisZelo = () => {
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
                <Typography className={classes.PageTitle}>WHAT IS ZELO?</Typography>
                <Typography className={classes.PageGroupTitle}>At PlayZelo, ZELO (PlayZelo Dollar) is the official bonus currency. 1 ZELO = 1 USD. You can play any game & Rain on one or many players with ZELO.</Typography>

                <Typography className={classes.PageTitle}>HOW TO UNLOCK YOUR ZELO?</Typography>
                <Typography className={classes.PageGroupTitle}>Locked ZELO is obtained through specific bonuses, such as Deposit Bonus and Magic Wheel.</Typography>
                <Typography className={classes.PageGroupTitle}>Unlocking ZELO is easy! On each bet, it will unlock proportionally to the money you wager.</Typography>
                <Box className={classes.WarningBox}>
                    Unlocked amount = 2% of all the money wagered.
                </Box>

                <Typography className={classes.PageTitle}>HOW TO CLAIM YOUR UNLOCKED ZELO?</Typography>
                <Typography className={classes.PageGroupTitle}>As you wager in any currency, your ZELO locker will fill with unlocked ZELO.</Typography>
                <Typography className={classes.PageGroupTitle}>Once you reach the minimum of 5.00ZELO, you’ll be able to click Claim, and the unlocked ZELO will be transferred directly to your ZELO balance. After that, your ZELO will be available to use.</Typography>

                <Typography className={classes.PageTitle}>CAN YOU EXCHANGE ZELO FOR ANY OTHER CURRENCY?</Typography>
                <Typography className={classes.PageGroupTitle}>Of course. The great thing is that the value of the ZELO is bound to the price of USD, and you can swap ZELO into other currencies whenever you want.</Typography>
            </Box>
        </Box>
    );
};

export default WhatisZelo;