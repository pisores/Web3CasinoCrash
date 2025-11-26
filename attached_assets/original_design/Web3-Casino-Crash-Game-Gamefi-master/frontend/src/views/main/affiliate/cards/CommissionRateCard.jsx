import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TournamentsIcon from "assets/icons/Tournaments.png";

const useStyles = makeStyles(() => ({
    CardLayout: {
        height: 368,
        backgroundColor: '#2C2C3A',
        backgroundImage: 'url("/assets/images/unlockerbg.png")',
        borderRadius: 30,
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        padding: 25,
        "@media (max-width: 1100px)": {
            height: 250,
            borderRadius: 16
        }
    },
    CardTitleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16
    },
    CardTitleIcon: {
        width: 39,
        "@media (max-width: 1100px)": {
            width: 20
        }
    },
    CardTitleText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: '20px',
        textTransform: 'uppercase',
        color: '#FFF',
        "@media (max-width: 1100px)": {
            fontSize: 12,
            lineHeight: '16px'
        }
    },
    RateList: {
        width: '100%',
        background: '#424253',
        borderRadius: 8,
        padding: '26px 20px',
        margin: '34px 0px 16px',
        display: 'flex',
        gap: 27,
        flexDirection: 'column',
        "@media (max-width: 1100px)": {
            marginTop: 20,
            marginBottom: 15,
            gap: 10
        }
    },
    RateRow: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        "@media (max-width: 1100px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    SubmitButton: {
        background: '#FED847',
        borderRadius: 8,
        height: 51,
        width: 196,
        color: '#1F1E25',
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 14,
        lineHeight: '18px',
        textTransform: 'uppercase',
        left: '50%',
        transform: 'translate(-50%)',
        "@media (max-width: 1100px)": {
            height: 40
        }
    }
}));

const CommissionRateCard = () => {
    const classes = useStyles();

    const rateData = [
        { label: 'Tier1', rate: 15 },
        { label: 'Tier2', rate: 5 },
        { label: 'Tier3', rate: 1 }
    ];

    return (
        <Box className={classes.CardLayout}>
            <Box className={classes.CardTitleBox}>
                <img className={classes.CardTitleIcon} src={TournamentsIcon} alt="icon" />
                <span className={classes.CardTitleText}>Commission Rates</span>
            </Box>
            <Box className={classes.RateList}>
                {
                    rateData.map((item, index) => (
                        <Box key={index} className={classes.RateRow}>
                            <span>{item.label}</span>
                            <span>{item.rate}%</span>
                        </Box>
                    ))
                }
            </Box>
            <a rel="noreferrer" href="https://qdm4pdnhp80.typeform.com/to/S4IuKGjZ" target="_blank">
                <Button className={classes.SubmitButton}>Increase</Button>
            </a>
        </Box>
    );
};

export default CommissionRateCard;