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

const HowToSetupHelp = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/security', label: 'Security' }
    ];

    const data = [
        'Download and install either Authy or Google Authenticator on your phone.',
        'Go to your Profile.',
        'Unfold the menu on the right top corner of your profile and select Settings or click on the button and select the Two Factor Authentication option.',
        'Tap on the Authenticator on-off switch to turn on 2FA.',
        'To move forward, you’ll need to scan a QR code with your authentication app or enter the backup code that appears on the Configure Authenticator window to enable 2FA.',
        'Once enabled, you can add any FIDO2 key you prefer to your account using a computer or Android device by clicking on MANAGE next to Security Keys.'
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>HOW TO SET UP TWO-FACTOR AUTHENTICATION</Typography>
                <Typography className={classes.PageGroupTitle}>To choose and enable a two-factor authentication method (2FA) you need to:</Typography>
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
                <Typography className={classes.PageGroupTitle}>PlayZelo supports FIDO2 authentication, so Yubikey, Trezor, Ledger, all Android 7.0 or higher biometrics, Chrome OS, and iOS14 devices can function as a security key. So can macOS with biometric sensors and PCs with Windows 10 that have Windows Hello set up.</Typography>
                <Box className={classes.WarningBox}>
                    Remember to download your back-up code and keep it in a safe place. If you lose your phone or delete your authentication app, you can use your backup code to enter PlayZelo. Keep in mind that each backup code can only be used once.
                </Box>
            </Box>
        </Box>
    );
};

export default HowToSetupHelp;