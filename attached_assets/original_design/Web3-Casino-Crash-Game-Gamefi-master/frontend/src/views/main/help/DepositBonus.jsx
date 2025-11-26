import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

const useStyles = makeStyles(() => ({
    HelpLayout: {
        width: '100%',
        padding: '12px'
    },
    SearchBox: {
        maxWidth: '576px',
        height: '40px',
        width: '100%',
        position: 'relative',
        marginTop: '20px',
        "&>svg": {
            position: 'absolute',
            right: '20px',
            top: '10px'
        }
    },
    SearchInput: {
        border: 'none',
        background: '#424253',
        color: '#FFF',
        borderRadius: '8px',
        outline: 'none',
        width: '100%',
        height: '100%',
        fontSize: '14px',
        fontFamily: 'Styrene A Web',
        paddingLeft: '16px',
        paddingRight: '50px',
        "&::placeholder": {
            color: 'inherit'
        }
    },
    HelpTreeBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    HelpTree: {
        listStyle: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0px',
        gap: '40px',
        "&>li:last-child:after": {
            content: '""'
        },
        "&>li:last-child>div": {
            padding: '11px 18px',
            background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
            borderRadius: '8px'
        },
        "@media (max-width: 681px)": {
            flexDirection: 'column',
            alignItems: 'flex-start'
        }
    },
    HelpTreeItem: {
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: '700',
        position: 'relative',
        cursor: 'pointer',
        "&:after": {
            content: 'url(/assets/images/ArrowRight.svg)',
            color: '#FFF',
            position: 'absolute',
            right: '-20px',
            top: '1px',
        }
    },
    HelpDetailBox: {
        width: '100%',
        maxWidth: '878px',
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        "&>*": {
            fontFamily: 'Styrene A Web'
        }
    },
    HelpDetailSubBox: {
        marginTop: '20px'
    },
    NormalText: {
        fontSize: '18px',
        fontWeight: '100',
        width: '100%',
        maxWidth: '831px',
        lineHeight: '178.2%',
        marginTop: '24px'
    },
    BalanceList: {
        "&>li": {
            fontSize: '18px',
            lineHeight: '26px'
        }
    }
}));

const HelpLayout = () => {
    const classes = useStyles();

    return (
        <Box className={classes.HelpLayout}>
            <Box className={classes.SearchBox}>
                <input className={classes.SearchInput} placeholder="Search" />
                <SearchIcon />
            </Box>
            <Box className={classes.HelpTreeBox}>
                <ul className={classes.HelpTree}>
                    <li className={classes.HelpTreeItem}><Box>PlayZelo Support</Box></li>
                    <li className={classes.HelpTreeItem}><Box>Bonuses</Box></li>
                    <li className={classes.HelpTreeItem}><Box>Deposit Bonus</Box></li>
                </ul>
            </Box>
            <Box className={classes.HelpDetailBox}>
                <Box className={classes.HelpDetailSubBox}>
                    <h2 style={{ textTransform: 'uppercase', fontSize: '32px', lineHeight: '48px' }}>How does the deposit bonus work?</h2>
                    <Box className={classes.NormalText}>PlayZelo gives you the most bang for your buck in bonuses. With our latest bonus pack, you can reach up to a 1260% match on four deposits. The bonus amounts will be awarded in locked PZD and available for you to unlock by wagering in any of the site’s games.</Box>
                    <Box className={classes.NormalText}>Take a look at the bonus breakdown:</Box>
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
                    <h2 style={{ textTransform: 'uppercase', fontSize: '32px', lineHeight: '48px' }}>WHAT IS THE MAXIMUM AMOUNT I CAN MATCH ON EACH DEPOSIT BONUS?</h2>
                    <Box className={classes.NormalText}>The limits on each deposit are:</Box>
                    <ul className={classes.BalanceList} style={{ listStyle: 'none', padding: '0px' }}>
                        <li>First: 20,000 ZELO</li>
                        <li>Second: 40,000 ZELO</li>
                        <li>Thrid: 60,000 ZELO</li>
                        <li>Fourth: 100,000 ZELO</li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
};

export default HelpLayout;