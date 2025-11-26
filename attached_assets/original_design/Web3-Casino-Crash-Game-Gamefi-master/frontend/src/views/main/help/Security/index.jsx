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

const HelpSecurityBox = () => {
    const classes = useStyles();

    const helpTreeData = [
        { to: '/app/help', label: 'PlayZelo Support' },
        { to: '/app/help/security', label: 'Security' }
    ];

    const subCategory = [
        { text: 'How to set up two-factor authentication', link: '/app/help/security/two-factor-authentication/how-to-set-up-2-factor-authentication' },
    ];

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.HelpTreeBox}>
                <HelpTree data={helpTreeData} />
            </Box>
            <Box className={classes.SubCategoryBox}>
                <Typography className={classes.SubCategoryTitle}>Two factor authentication</Typography>
                <Box className={classes.CategoryBox}>
                    <SubCategory data={subCategory} />
                </Box>
            </Box>
        </Box>
    );
};

export default HelpSecurityBox;