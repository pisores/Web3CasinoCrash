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
        color: '#FFF',
        marginTop: 30
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

const HowAutoBetWork = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/faq', label: 'Faq' }
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>HOW DOES AUTOBET WORK?</Typography>
                <Typography className={classes.PageGroupTitle}>The Autobet feature allows you to preset your plays. You can bet exactly what you want by modifying the bet amount with the increasing (+) and decreasing (-) buttons or by typing your desired bet. With Autobet, you can determine, before playing, the number of bets you want to play in a roll, the percentage of the bet you want to change when losing or winning, and the maximum amount you are willing to lose or win before stopping.</Typography>
                <Typography className={classes.PageGroupTitle}>Autobet can be stopped at any time with the Stop button and you can adjust your Autobet preferences between plays.</Typography>

                <Typography className={classes.PageTitle}>SEQUENCE PREVIEW</Typography>
                <Typography className={classes.PageGroupTitle}>Choose every cell you want to uncover in every play. Change the preview page to choose the cells you want to uncover in the next preset bet. You can select the Random option if you don’t want to set the uncovering patron manually. You can choose up to 5 play sequences. After that, they will repeat on a loop.</Typography>

                <Typography className={classes.PageTitle}>ON WIN / ON LOSS</Typography>
                <Typography className={classes.PageGroupTitle}>The default option of Reset to Base Bet means the bet amount won’t be modified between sequences.</Typography>
                <Typography className={classes.PageGroupTitle}>You can modify your bet On Win or On Loss by selecting the option Change Bet By %. To make your bet smaller, add a minus sign (-) before the percentage number on the Change Bet By % slot.</Typography>
                <Typography className={classes.PageGroupTitle}>The third option is Stop Autobet, which will stop the feature when you win or lose a sequence.</Typography>

                <Typography className={classes.PageTitle}>ON BONUS</Typography>
                <Typography className={classes.PageGroupTitle}>Do Nothing, Take Winning (will take the winnings of that bet when you hit the multiplier and then continue with the other preset bets), Stop Autobet (stop all the autobet sequence when you hit a multiplier).</Typography>

                <Typography className={classes.PageTitle}>STOP ON PROFIT / STOP ON LOSS</Typography>
                <Typography className={classes.PageGroupTitle}>You can choose a limited amount of money at which you wish to stop the Autobet on profit or loss.</Typography>
            </Box>
        </Box>
    );
};

export default HowAutoBetWork;