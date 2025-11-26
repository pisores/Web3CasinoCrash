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

const HelpGameBox = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/games', label: 'PlayZelo Games' }
    ];

    const subCategory = [
        { text: 'How to play scissor', link: '/app/help/games/how-to-play/scissor' },
        { text: 'How to play turtle', link: '/app/help/games/how-to-play/turtle' },
        { text: 'How to play mines', link: '/app/help/games/how-to-play/mines' },
        { text: 'How to play dice', link: '/app/help/games/how-to-play/dice' },
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.SubCategoryBox}>
                <Typography className={classes.SubCategoryTitle}>How to play</Typography>
                <Box className={classes.CategoryBox}>
                    <SubCategory data={subCategory} />
                </Box>
            </Box>
        </Box>
    );
};

export default HelpGameBox;