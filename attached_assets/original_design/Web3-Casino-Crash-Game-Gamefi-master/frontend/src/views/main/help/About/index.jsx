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

const HelpAboutBox = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/about', label: 'About PlayZelo' }
    ];

    const subCategoryGroup = [
        {
            title: 'Chat',
            data: [
                { text: 'What are the chat rules?', link: '/app/help/about/chat/rules' }
            ]
        },
        {
            title: 'Account',
            data: [
                { text: 'How can I self exclude from the game?', link: '/app/help/about/account/how-can-i-self-exclude-from-the-game' },
                { text: 'HOW TO CREATE YOUR ACCOUNT', link: '/app/help/about/account/how-to-create-your-account' }
            ]
        },
        {
            title: 'Level up',
            data: [
                { text: 'How can I Level Up?', link: '/app/help/about/level-up/how-can-i-level-up' }
            ]
        },
        {
            title: 'Provably fair',
            data: [
                { text: 'What is provably fair?', link: '/app/help/about/provably-fair/what-is-provably-fair' }
            ]
        },
        {
            title: 'ZELO',
            data: [
                { text: 'What is ZELO', link: '/app/help/about/zelo/what-is-zelo' }
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

export default HelpAboutBox;