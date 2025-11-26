import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    HelpTree: {
        listStyle: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0px',
        gap: '40px',
        "&>li:last-child>a:after": {
            content: '""'
        },
        "&>li:last-child>a>div": {
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
    }
}));

const HelpTree = ({ data }) => {
    const classes = useStyles();
    return (
        <ul className={classes.HelpTree}>
            {
                data.map((item, index) => (
                    <li key={index}>
                        <Link to={item.to} className={classes.HelpTreeItem}>
                            <Box>{item.label}</Box>
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
};

export default HelpTree;