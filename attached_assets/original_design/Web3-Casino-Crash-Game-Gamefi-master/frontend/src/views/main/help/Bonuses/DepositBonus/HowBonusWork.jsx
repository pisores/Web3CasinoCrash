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
    },
    NormalText: {
        fontSize: '18px',
        fontWeight: '100',
        width: '100%',
        marginTop: '24px',
        fontFamily: 'Styrene A Web',
        color: '#FFF'
    },
    BalanceList: {
        "&>li": {
            fontFamily: 'Styrene A Web',
            fontSize: '18px',
            lineHeight: '26px',
            color: '#FFF'
        }
    }
}));

const HowBonusWork = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/bonuses', label: 'Bonuses' }
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>HOW TO WITHDRAW PLAYZELO DOLLAR</Typography>
                <Typography className={classes.PageGroupTitle}>BitKong gives you the most bang for your buck in bonuses. With our latest bonus pack, you can reach up to a 1260% match on four deposits. The bonus amounts will be awarded in locked BKD and available for you to unlock by wagering in any of the site’s games.</Typography>
                <Typography className={classes.PageGroupTitle}>Take a look at the bonus breakdown:</Typography>
                <Box className={classes.NormalText} style={{ fontWeight: '900' }}><b>First Deposit</b></Box>
                <Box className={classes.NormalText}>You can get a bonus of up to 270% of your first deposit. If you deposit between:</Box>
                <ul className={classes.BalanceList}>
                    <li>$30 and $79, you will get a 120% bonus</li>
                    <li>$80 and $399, you will get a 150% bonus</li>
                    <li>$400 and above, you will get a 270% bonus</li>
                </ul>
                <Box className={classes.NormalText} style={{ fontWeight: '900' }}><b>Second Deposit</b></Box>
                <Box className={classes.NormalText}>With your second deposit, you can get up to a 300% bonus, depending on the deposited amount. If you deposit between:</Box>
                <ul className={classes.BalanceList}>
                    <li>$60 and $159, you will get a 150% bonus</li>
                    <li>$80 and $399, you will get a 150% bonus</li>
                    <li>$400 and above, you will get a 270% bonus</li>
                </ul>
                <Box className={classes.NormalText} style={{ fontWeight: '900' }}><b>Third Deposit</b></Box>
                <Box className={classes.NormalText}>Your third deposit can have up to a 330% bonus. If you deposit between:</Box>
                <ul className={classes.BalanceList}>
                    <li>$30 and $79, you will get a 120% bonus</li>
                    <li>$80 and $399, you will get a 150% bonus</li>
                    <li>$400 and above, you will get a 270% bonus</li>
                </ul>
                <Box className={classes.NormalText} style={{ fontWeight: '900' }}><b>Fourth Deposit</b></Box>
                <Box className={classes.NormalText}>On your fourth deposit, you can get up to a 360% match of your deposit. If you deposit between:</Box>
                <ul className={classes.BalanceList}>
                    <li>$30 and $79, you will get a 120% bonus</li>
                    <li>$80 and $399, you will get a 150% bonus</li>
                    <li>$400 and above, you will get a 270% bonus</li>
                </ul>
                <h2 style={{ textTransform: 'uppercase', fontSize: '32px', lineHeight: '48px', color: '#FFF' }}>WHAT IS THE MAXIMUM AMOUNT I CAN MATCH ON EACH DEPOSIT BONUS?</h2>
                <Box className={classes.NormalText}>The limits on each deposit are:</Box>
                <ul className={classes.BalanceList} style={{ listStyle: 'none', padding: '0px' }}>
                    <li>First: 20,000 ZELO</li>
                    <li>Second: 40,000 ZELO</li>
                    <li>Thrid: 60,000 ZELO</li>
                    <li>Fourth: 100,000 ZELO</li>
                </ul>
            </Box>
        </Box>
    );
};

export default HowBonusWork;