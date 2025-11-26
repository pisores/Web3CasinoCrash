import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((props) => ({
    BonusesCardBox: {
        background: (props) => props.colored ? 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)' : '#2C2C3A',
        borderRadius: '0px 30px 30px 30px',
        maxWidth: '506px',
        width: 'calc(33% - 13px)',
        height: '216px',
        position: 'relative',
        "@media (max-width: 1580px)": {
            width: 'calc(50% - 10px)'
        },
        "@media (max-width: 1149px)": {
            width: '100%',
            maxWidth: 'unset'
        }
    },
    BonusesCardBg: {
        position: 'relative',
        left: 'calc(100% - 165px)',
        top: '10px'
    },
    TextBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'flex-start',
        gap: '13px',
        width: 'calc(100% - 40px)',
        margin: 'auto'
    },
    BonusTitle: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 900,
        fontSize: "21px",
        lineHeight: "26px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    BonusText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "148.7%",
        color: "#FFFFFF",
        opacity: 0.5
    },
    BounsIcon: {
        position: 'absolute',
        top: '-40px'
    }
}));

const BonusesCard = ({ title, text, icon, colored }) => {
    const classes = useStyles({ colored });

    return (
        <Box className={classes.BonusesCardBox}>
            <img src={`/assets/images/${icon}.png`} alt="icon" className={classes.BounsIcon} width="110px" height="112px" />
            <img src={!colored ? "/assets/images/BonusCardBg1.png" : "/assets/images/BonusCardBg2.png"} alt="icon" className={classes.BonusesCardBg} />
            <Box className={classes.TextBox}>
                <span className={classes.BonusTitle}>
                    {title}
                </span>
                <span className={classes.BonusText}>
                    {text}
                </span>
            </Box>
        </Box>
    );
};

export default BonusesCard;