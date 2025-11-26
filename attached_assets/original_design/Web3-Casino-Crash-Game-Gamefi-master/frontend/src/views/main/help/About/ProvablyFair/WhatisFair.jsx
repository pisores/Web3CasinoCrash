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

const WhatisFair = () => {
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
                <Typography className={classes.PageTitle}>WHAT IS PROVABLY FAIR?</Typography>
                <Typography className={classes.PageGroupTitle}>When a game is provably fair, it means that it provides a transparent way for the player to verify that the site generates the result of every play randomly.</Typography>
                <Typography className={classes.PageGroupTitle}>At PlayZelo, all of the games are entirely provably fair, which makes PlayZelo the only 100% provably fair iGaming platform in the market.</Typography>
                <Typography className={classes.PageGroupTitle}>The outcome of every play comes from combining a hashed Server Seed, provided by PlayZelo, and a Client Seed given by the browser in which you are playing.</Typography>
                <Typography className={classes.PageGroupTitle}>The combination of the Client Seed and the Server Seed generates random outcomes for every play.</Typography>
                <Typography className={classes.PageGroupTitle}>We use an algorithm that produces a Server Seed beforehand and keeps them in a hash that can be verified by the user after the play ends.</Typography>
                <Typography className={classes.PageGroupTitle}>You can see the complete Server Seed after generating a new one by clicking on the Randomize button of the bet details window. After randomizing, you can check all bets made with the previous Server Seed.</Typography>

                <Typography className={classes.PageTitle}>HOW CAN I VERIFY A BET?</Typography>
                <Typography className={classes.PageGroupTitle}>You can check your bets by going to the sidebar and clicking on My bets. Choose the bet you want to check and click on it. You’ll be able to see your moves in that play, the location of every winning cell, the Client Seed the hashed Server Seed, and the Nonce number.</Typography>
                <Typography className={classes.PageGroupTitle}>You can also check the fairness with our in-game calculator or use the open-source version.</Typography>

                <Typography className={classes.PageTitle}>HOW CAN I SEE THE COMPLETE SERVER SEED?</Typography>
                <Typography className={classes.PageGroupTitle}>To see the complete Server Seed, you’ll need to change the current seed by clicking on Randomize. This will generate a new Server Seed which will be used in all future bets until you randomize again.</Typography>
                <Typography className={classes.PageGroupTitle}>After randomizing and clicking on Verify you’ll be able to see the outcome of every play with that Server-Client Seed combination by going up and down the Nonce switcher.</Typography>

                <Typography className={classes.PageTitle}>HOW CAN I RANDOMIZE MY CLIENT SEED?</Typography>
                <Typography className={classes.PageGroupTitle}>You can randomize your Client Seed by going to the Fairness tab on the menu and clicking on the randomize symbol 🔄 on the Client Seed box. You can also change your seed manually by typing it yourself.</Typography>
            </Box>
        </Box>
    );
};

export default WhatisFair;