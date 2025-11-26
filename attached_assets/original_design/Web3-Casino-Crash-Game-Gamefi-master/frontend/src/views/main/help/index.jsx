import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    HelpLayout: {
        width: '100%'
    },
    ArticleTitle: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 28,
        lineHeight: '36px',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#FFF',
        marginTop: '56px'
    },
    ArticleBox: {
        width: '100%',
        padding: '55px 0px',
        display: 'flex',
        flexDirection: 'row',
        gap: 74,
        border: '1px solid #363646',
        borderRadius: 8,
        marginTop: 34,
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    ArticleItemBox: {
        width: 300
    },
    ArticleItemTitle: {
        width: '100%',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#FFF',
        fontSize: 20,
        fontWeight: 700
    },
    ArticleItemCategory: {
        color: '#6FE482',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: 'Cera Pro',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    CategoryBox: {
        maxWidth: 1044,
        margin: 'auto',
        marginTop: 60,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 60,
        justifyContent: 'space-evenly'
        // "@media (max-width: 940px)": {
        // }
    },
    CategoryItemBox: {
        background: '#424253',
        borderRadius: '30px',
        width: 308,
        minHeight: 333,
        padding: '34px 55px 22px',
        "@media (max-width: 940px)": {
            width: 250,
            minHeight: 280
        }
    },
    CategoryIcon: {
        width: '100%'
    },
    CategoryTitle: {
        fontSize: 24,
        lineHeight: '31px',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#FFF',
        fontWeight: 700,
        marginTop: 19
    }
}));

const ArticleItem = ({ title, category, classes, link }) => {
    return (
        <Link to={link}>
            <Box className={classes.ArticleItemBox}>
                <Typography className={classes.ArticleItemTitle}>{title}</Typography>
                <Typography className={classes.ArticleItemCategory}>{category}</Typography>
            </Box>
        </Link>
    )
};

const CategoryItem = ({ title, icon, link, classes }) => {
    return (
        <Link to={`/app/help${link}`}>
            <Box className={classes.CategoryItemBox}>
                <img src={`/assets/images/help/${icon}.png`} alt="icon" className={classes.CategoryIcon} />
                <Typography className={classes.CategoryTitle}>{title}</Typography>
            </Box>
        </Link>
    )
};

const HelpLayout = () => {
    const classes = useStyles();

    const featuredArticles = [
        {
            title: 'How do tournaments work?',
            category: 'faq',
            link: '/app/help/faq/tournaments/how-do-tournaments-work'
        },
        {
            title: 'What is provably fair?',
            category: 'about playzelo',
            link: '/app/help/about/provably-fair/what-is-provably-fair'
        },
        {
            title: 'How to deposit BTC with cash app',
            category: 'wallet',
            link: '/app/help/wallet/deposits/how-to-deposit-btc-with-cash-app'
        },
        {
            title: 'How to create your account',
            category: 'about playzelo',
            link: '/app/help/about/account/how-to-create-your-account'
        }
    ];

    const categoryData = [
        { title: 'Playzelo games', icon: 'games', link: '/games' },
        { title: 'Security', icon: 'security', link: '/security' },
        { title: 'About Playzelo', icon: 'about', link: '/about' },
        { title: 'Faq', icon: 'faq', link: '/faq' },
        { title: 'Wallet', icon: 'wallet', link: '/wallet' },
        { title: 'Bonuses', icon: 'bonuses', link: '/bonuses' },
        // { title: 'Affiliate Program', icon: 'affiliate', link: '/affiliate' }
    ];

    return (
        <Box className={classes.HelpLayout}>
            <Typography className={classes.ArticleTitle}>Featured Articles</Typography>
            <Box className={classes.ArticleBox}>
                {
                    featuredArticles.map((article, index) => (
                        <ArticleItem {...article} classes={classes} key={index} />
                    ))
                }
            </Box>
            <Box className={classes.CategoryBox}>
                {
                    categoryData.map((category, index) => (
                        <CategoryItem {...category} key={index} classes={classes} />
                    ))
                }
            </Box>
        </Box>
    );
};

export default HelpLayout;