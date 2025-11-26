import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HelpTree from "../HelpTree";
import SubCategory from "../SubCategory";

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
    SubCategoryBox: {
        marginTop: 30
    },
    SubCategoryTitle: {
        fontWeight: 900,
        fontSize: 28,
        textAlign: 'left',
        textTransform: 'uppercase',
        color: '#FFF'
    }
}));

const HelpWalletBox = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/wallet', label: 'Wallet' }
    ];

    const subCategoryGroup = [
        {
            title: 'CURRENCIES',
            data: [
                { text: 'What networks are supported by the wallet?', link: '/app/help/wallet/currencies/what-networks-are-supported-by-the-wallet' }
            ]
        },
        {
            title: 'Deposits',
            data: [
                { text: 'How to Deposit Using Bitcoin Lightning Network', link: '/app/help/wallet/deposits/how-to-deposit-lightning-network' },
                { text: 'How to deposit BTC with Cash App', link: '/app/help/wallet/deposits/how-to-deposit-btc-with-cash-app' }
            ]
        },
        {
            title: 'WITHDRAWALS',
            data: [
                { text: 'How to withdraw PLAYZELO Dollar', link: '/app/help/wallet/withdrawals/how-to-withdraw-playzelo-dollar' },
                { text: 'How to make a withdrawal', link: '/app/help/wallet/withdrawals/how-to-withdrawal' },
            ]
        }
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            {
                subCategoryGroup.map((item, index) => (
                    <Box key={index} className={classes.SubCategoryBox}>
                        <Typography className={classes.SubCategoryTitle}>{item.title}</Typography>
                        <Box className={classes.CategoryBox}>
                            <SubCategory data={item.data} />
                        </Box>
                    </Box>
                ))
            }
        </Box>
    );
};

export default HelpWalletBox;