import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BLACKJACK_CARD_RESULT } from "config/constant";

const useStyles = makeStyles(() => ({
    Container: {
        width: 120,
        height: 172
    }
}));

const CardBox = ({ type, number, open = false, result = BLACKJACK_CARD_RESULT.NONE }) => {
    const classes = useStyles();
    const CardsUrl = "/assets/images/cards/";
    return (
        <Box className={classes.Container}>
            {
                !open ?
                    <img src={`${CardsUrl}card-back.jpg`} alt="img" />
                    :
                    <img src={`${CardsUrl}${type}-${number}.jpg`} alt="img" />
            }
        </Box>
    );
};

export default CardBox;