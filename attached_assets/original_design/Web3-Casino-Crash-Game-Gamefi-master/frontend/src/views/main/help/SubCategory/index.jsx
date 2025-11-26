import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { ReactComponent as StarIcon } from "assets/icons/StarIcon.svg";

const useStyles = makeStyles(() => ({
    MainLayout: {
        columnCount: 3,
        listStyle: 'none',
        padding: 0,
        "&>li": {
            margin: '0px 1em 0.75rem 0px'
        }
    },
    SubCategoryItem: {
        display: 'flex',
        gap: 9,
        alignItems: 'center',
        "&>span": {
            fontSize: 16,
            color: '#FFF',
            fontWeight: 500,
            textTransform: 'capitalize'
        }
    }
}));

const SubCategory = ({ data }) => {
    const classes = useStyles();

    return (
        <ul className={classes.MainLayout}>
            {
                data.map((item, index) => (
                    <li key={index} >
                        <Link to={item.link}>
                            <Box className={classes.SubCategoryItem}>
                                <StarIcon />
                                <span>{item.text}</span>
                            </Box>
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
};

export default SubCategory;