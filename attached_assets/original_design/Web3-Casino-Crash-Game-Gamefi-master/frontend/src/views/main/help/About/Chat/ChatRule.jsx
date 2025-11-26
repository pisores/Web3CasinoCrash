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

const ChatRule = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/about', label: 'About' }
    ];

    const data = [
        'Making accusations regarding the fairness of the game without providing any proof will cause your account to be blocked. Remember that the game is provably fair and you can verify the transparency of every bet.',
        'Don’t engage in commercial activities like advertising, selling, buying, or any suspicious behavior that could be interpreted as scam attempts.',
        'Don’t ask other players for loans, rain, or post your crypto address begging for money.',
        'Be polite, don’t be “that guy.” Avoid offensive comments, harassment and writing in CAPS.',
        'Don’t spam.',
        'Use the designated language for each chat window.',
        'For personal safety reasons, be cautious to whom you disclose your last name, email address, home address, telephone number, or other personal information.',
        'Players don’t have to share game tactics with anyone if they don’t want to. Do not pressure other players to do so.',
        'All gaming platforms are great; please do not get into heated discussions about which one is not.',
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>WHAT ARE THE CHAT RULES?</Typography>
                <Typography className={classes.PageGroupTitle}>PlayZelo's community is friendly and respectful so whenever you talk in our chat remember to respect the following guidelines:</Typography>
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
                <Box className={classes.WarningBox}>
                    Remember to download your back-up code and keep it in a safe place. If you lose your phone or delete your authentication app, you can use your backup code to enter PlayZelo. Keep in mind that each backup code can only be used once.
                </Box>
            </Box>
        </Box>
    );
};

export default ChatRule;