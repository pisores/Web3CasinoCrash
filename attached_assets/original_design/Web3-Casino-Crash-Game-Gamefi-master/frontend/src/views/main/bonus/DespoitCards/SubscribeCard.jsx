import { Box, Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SubscribeIcon from "assets/icons/Tournaments.png";
import { ReactComponent as TelegramIcon } from "assets/icons/telegram.svg";
import QRCodeIcon from "assets/icons/qrcode.png";

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
            width: '100%',
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
    SubscirbeText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#FFFFFF",
        "&>label": {
            color: '#6FE482'
        },
        "@media (max-width: 681px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    SubscribeBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        background: '#424253',
        borderRadius: '8px',
        padding: '21px 14px 16px 14px',
        "@media (max-width: 681px)": {
            borderRadius: 4,
            flexDirection: 'column',
            padding: 10
        }
    },
    TitleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        "&>svg": {
            width: '58px',
            height: '58px'
        },
        "@media (max-width: 681px)": {
            gap: 6,
            "&>svg": {
                width: 30,
                height: 30
            }
        }
    },
    TitleHeader: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#FFFFFF",
        "& label": {
            color: '#6FE482'
        },
        "@media (max-width: 681px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    QRCodeButton: {
        width: '46px',
        height: '40px',
        background: '#FFFFFF',
        borderRadius: '8px',
        "&>img": {
            width: '100%',
            height: '100%'
        },
        "@media (max-width: 681px)": {
            width: 23,
            height: 20,
            borderRadius: 4
        }
    },
    SubscribeButton: {
        width: '145px',
        height: '40px',
        background: '#FED847',
        borderRadius: '8px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        textTransform: "uppercase",
        color: "#1F1E25",
        "@media (max-width: 681px)": {
            width: 100,
            height: 32,
            fontSize: 12,
            lineHeight: '14px',
            borderRadius: 4
        }
    },
    ActionBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    }
}));

const SubscribeCard = () => {
    const classes = useStyles();

    return (
        <Box className={classes.CardBox}>
            <Box className={classes.CardTitleBox}>
                <img src={SubscribeIcon} alt="icon" width="39px" height="34px" />
                <span>Subscribe</span>
            </Box>
            <Box className={classes.SubscirbeText}>
                Subscribe to our Telegram Affiliate bot, and earn up to <label>50%</label> revenue share
            </Box>
            <Box className={classes.SubscribeBox}>
                <Box className={classes.TitleBox}>
                    <TelegramIcon />
                    <Box className={classes.TitleHeader}>
                        <span>Affiliate bot</span>
                        <span>Earn up to <label>50%</label></span>
                    </Box>
                </Box>
                <Box className={classes.ActionBox}>
                    <IconButton className={classes.QRCodeButton}>
                        <img src={QRCodeIcon} alt="icon" />
                    </IconButton>
                    <Button className={classes.SubscribeButton}>Subscribe</Button>
                </Box>
            </Box>
            <Box className={classes.SubscribeBox}>
                <Box className={classes.TitleBox}>
                    <TelegramIcon />
                    <Box className={classes.TitleHeader}>
                        <span>Announcements</span>
                        <span>Earn up to <label>50%</label></span>
                    </Box>
                </Box>
                <Box className={classes.ActionBox}>
                    <IconButton className={classes.QRCodeButton}>
                        <img src={QRCodeIcon} alt="icon" />
                    </IconButton>
                    <Button className={classes.SubscribeButton}>Subscribe</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default SubscribeCard;