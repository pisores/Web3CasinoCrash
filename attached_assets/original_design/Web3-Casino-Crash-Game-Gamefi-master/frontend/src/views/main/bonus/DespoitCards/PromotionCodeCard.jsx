import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PromotionIcon from "assets/icons/promocode.png";
import { useState } from "react";

const useStyles = makeStyles(() => ({
    CardBox: {
        width: "calc(33% - 13px)",
        height: "368px",
        backgroundColor: "#2C2C3A",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        position: 'relative',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        "@media (max-width: 1800px)": {
            width: 'calc(50% - 10px)'
        },
        "@media (max-width: 1298px)": {
            width: '100%'
        },
        "@media (max-width: 681px)": {
            height: 240,
            borderRadius: 4,
            gap: 12,
            padding: 8
        }
    },
    CardTitleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '16px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "20px",
            textAlign: "right",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "@media (max-width: 681px)": {
            gap: 6,
            "&>span": {
                fontSize: 12,
                lineHeight: '14px'
            },
            "&>img": {
                width: 30,
                height: 32
            }
        }
    },
    CodeInputBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: '100%',
        "@media (max-width: 681px)": {
            gap: 6
        }
    },
    CodeInput: {
        background: '#424253',
        borderRadius: '8px',
        width: '55%',
        height: '51px',
        outline: 'none',
        border: 'none',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        paddingLeft: '13px',
        paddingRight: '13px',
        "&::placeholder": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "18px",
            color: "#FFFFFF"
        },
        "@media (max-width: 681px)": {
            borderRadius: 4,
            height: 36,
            fontSize: 12,
            lineHeight: '14px',
            paddingLeft: 6,
            paddingRight: 6,
            "&::placeholder": {
                fontSize: 12,
                lineHeight: '14px'
            }
        }
    },
    ClaimButton: {
        width: "50%",
        height: "51px",
        background: "#FED847",
        borderRadius: "8px",
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#1F1E25",
        "@media (max-width: 681px)": {
            height: 36,
            fontSize: 12,
            lineHeight: '14px',
            borderRadius: 4
        }
    },
    CardDetailBox: {
        width: '100%',
        height: '189px',
        background: '#424253',
        border: 'solid 1px #424253',
        borderRadius: '7px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        color: "#FFFFFF",
        "@media (max-width: 681px)": {
            fontSize: 12,
            lineHeight: '14px',
            borderRadius: 4,
            height: 120
        }
    }
}));

const PromotionCodeCard = () => {
    const classes = useStyles();

    const [promotionCode, setPromotionCode] = useState('');

    return (
        <Box className={classes.CardBox}>
            <Box className={classes.CardTitleBox}>
                <img src={PromotionIcon} alt="icon" width="65px" height="49px" />
                <span>Promotion code</span>
            </Box>
            <Box className={classes.CodeInputBox}>
                <input type="text" className={classes.CodeInput} placeholder="Enter code" value={promotionCode} onChange={(e) => setPromotionCode(e.target.value)} />
                <Button className={classes.ClaimButton}>Claim</Button>
            </Box>
            <Box className={classes.CardDetailBox}>
                Type the code and click redeem to participate.
            </Box>
        </Box>
    );
};

export default PromotionCodeCard;