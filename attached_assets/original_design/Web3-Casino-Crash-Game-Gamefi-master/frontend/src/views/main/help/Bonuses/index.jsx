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

const HelpBonusesBox = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/bonuses', label: 'Bonuses' }
    ];

    const subCategoryGroup = [
        {
            title: 'DEPOSIT BONUS',
            data: [
                { text: 'How Does the Deposit Bonus Work?', link: '/app/help/bonuses/deposit-bonus/how-does-the-deposit-bonus-work' }
            ]
        },
        {
            title: 'LOCKED BONUSES',
            data: [
                { text: 'What are the terms of the locked bonuses?', link: '/app/help/bonuses/locked-bonuses/terms-of-the-locked-bonuses' },
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

export default HelpBonusesBox;