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

const HelpFaqBox = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/faq', label: 'Faq' }
    ];

    const subCategoryGroup = [
        {
            title: 'Autobet',
            data: [
                { text: 'How does Autobet work?', link: '/app/help/faq/autobet/how-does-autobet-work' }
            ]
        },
        // {
        //     title: 'HOUSE EDGE',
        //     data: [
        //         { text: 'How does PlayZelo House Edge work?', link: '/app/help/faq/house-edge/how-does-playzelo-house-edge-work' }
        //     ]
        // },
        {
            title: 'TOURNAMENTS',
            data: [
                { text: 'How do tournaments work?', link: '/app/help/faq/tournaments/how-do-tournaments-work' }
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

export default HelpFaqBox;