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

const HowToWithdraw = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/wallet', label: 'Wallet' }
    ];

    const data = [
        'Click on the Withdraw tab.',
        'Select the crypto account from which you want to cash out money.',
        'Choose the withdrawal method you’d like to use. You can connect to a supported Web3 wallet or withdraw directly to any supported address.',
        'Copy the address to which you want to cash out your money and paste it into the Address slot.',
        'If you are connected to a Web3 wallet, be sure to choose a network from the ones supported by your wallet.',
        'Enter your Tag/Memo if required.',
        'Enter the amount you wish to withdraw on the Amount slot. For your convenience, the amount you will withdraw will be shown also in the secondary currency you’ve selected. You can also click on the option Max option and cash out all the available funds from that account.',
        'Click on Withdraw.',
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.DetailBox}>
                <Typography className={classes.PageTitle}>HOW TO WITHDRAW PLAYZELO DOLLAR</Typography>
                <Typography className={classes.PageGroupTitle}>To make a withdrawal, you need to unfold the menu on the top right corner of the homepage and click on Wallet. Next, follow these simple steps:</Typography>
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
                    Remember that withdrawing money into an address that does not match the currency you chose will cause the loss of the withdrawal.
                </Box>
                <Box className={classes.WarningBox}>
                    Remember that you can only withdraw crypto and not fiat money. To withdraw your fiat balance, you need to swap the amount to crypto and then withdraw.
                </Box>
            </Box>
        </Box>
    );
};

export default HowToWithdraw;