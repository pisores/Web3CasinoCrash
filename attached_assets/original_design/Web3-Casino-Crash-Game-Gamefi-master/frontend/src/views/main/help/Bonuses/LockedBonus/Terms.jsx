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

const ZeloWithdraw = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/bonuses', label: 'Bonuses' }
    ];

    const data = [
        'You acknowledge that the amounts awarded to you are expressed in locked ZELO.',
        'You acknowledge that 1ZELO=1USD.',
        'You accept that to unlock your bonuses you need to wager and that the unlocking ratio will be 2% of all the money you wagered.',
        'You acknowledge that the minimum amount of unlocked money you can claim is 5ZELO.',
        'Bonus abuse caused by the registration of multiple accounts will be penalized with the termination of all the accounts belonging to the same user and the confiscation of the bonuses awarded.',
        'PlayZelo reserves the right to amend, cancel, reclaim or refuse locked reward bonuses or any promotion at its own discretion.'
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>WHAT ARE THE TERMS OF THE LOCKED BONUSES?</Typography>
                <Typography className={classes.PageGroupTitle}>By receiving your Magic Wheel, Deposit Bonus, Leaderboard bonuses, and any other locked bonuses you agree to the following Terms and Conditions and the site’s general Terms of Use:</Typography>
                <Box className={classes.DataTextBox}>
                    {
                        data.map((item, index) => (
                            <Box className={classes.DataLine} key={index}>
                                <Box className={classes.DataIndex}>{index + 1}</Box>
                                <Box className={classes.DataText}>{item}</Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default ZeloWithdraw;