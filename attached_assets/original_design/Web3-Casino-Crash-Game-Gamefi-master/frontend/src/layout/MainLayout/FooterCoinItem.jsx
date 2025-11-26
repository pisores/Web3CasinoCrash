import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    FooterCoinItemBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        "&>img": {
            width: '38px',
            height: '38px'
        },
        "&>span": {
            fontFamily: 'Cera Pro',
            fontWeight: '700',
            fontSize: '17px',
            lineHieght: '21px',
            color: '#5B5B72',
            "@media (max-width: 681px)": {
                display: 'none'
            }
        }
    }
}));

const FooterCoinItem = ({ coin }) => {
    const classes = useStyles();
    const coinType = Object.keys(coin)[0];
    const coinName = coin[coinType];

    return (
        <Box className={classes.FooterCoinItemBox}>
            <img src={`/assets/images/coins/${coinType.toLowerCase()}.png`} alt="icon" />
            <span>{coinName}</span>
        </Box>
    );
};

export default FooterCoinItem;