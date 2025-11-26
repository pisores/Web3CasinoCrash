import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MoneyIcon from "assets/icons/Crypto3.png";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    CardContainer: {
        width: '100%',
        height: '309px',
        background: '#2C2C3A',
        borderRadius: '24px'
    },
    CardImageBox: {
        width: '100%',
        height: 'calc(100% - 69px)',
        backgroundImage: (props) => `url(/assets/images/games/${props.gameTitle}.png)`,
        backgroundSize: '100% 100%',
        borderRadius: '24px 24px 0px 0px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%',
        position: 'relative'
    },
    CardName: {
        position: 'absolute',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontFamily: "'Styrene A Web'",
        fontWeight: 900,
        fontSize: "32px",
        lineHeight: "34px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        textShadow: "-12.731px 12.731px 0px rgba(31, 30, 37, 0.25)",
        "&>label": {
            color: '#FEF101',
            fontFamily: 'inherit'
        }
    },
    FeaturedBox: {
        position: 'absolute',
        left: '20px',
        top: '20px',
        width: "162px",
        height: "43px",
        background: "#6FE482",
        borderRadius: "8px",
        fontFamily: "'Styrene A Web'",
        fontWeight: 700,
        fontSize: "18px",
        lineHeight: "18px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#000000",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    CardBottomBox: {
        width: '100%',
        height: '69px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '21px'
    },
    AmountBox: {
        padding: '4px 10px 5px 6px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        background: "#424253",
        borderRadius: "7px",
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "23px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        }
    },
    HiddenText: {
        fontFamily: "'Cera Pro'",
        fontWeight: 700,
        fontSize: "17px",
        lineHeight: "21px",
        color: "#FFFFFF"
    }
}));

const NormalGameCard = ({ gameTitle, link }) => {
    const classes = useStyles({ gameTitle });

    return (
        <Link to={link}>
            <Box className={classes.CardContainer}>
                <Box className={classes.CardImageBox}>
                    {/* <span className={classes.CardName}>{gameTitle}</span> */}
                </Box>
                <Box className={classes.CardBottomBox}>
                    <span className={classes.HiddenText}>Hidden</span>
                    <Box className={classes.AmountBox}>
                        <img src={MoneyIcon} alt="icon" width="32px" height="33px" />
                        <span>0.03</span>
                    </Box>
                </Box>
            </Box>
        </Link>
    );
};

export default NormalGameCard;