import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TournamentsIcon from "assets/icons/Tournaments.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { claimCampaignAmount } from "redux/actions/auth";

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
    AmountBox: {
        margin: 'auto',
        background: '#424253',
        borderRadius: 7,
        padding: '9px 19px',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 34,
        width: 152,
        "@media (max-width: 1100px)": {
            width: 120,
            marginTop: 25
        }
    },
    CurrencyIcon: {
        width: 32,
        "@media (max-width: 1100px)": {
            width: 24
        }
    },
    AmountText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 26,
        lineHeight: '33px',
        color: '#FFF',
        "@media (max-width: 1100px)": {
            fontSize: 18,
            lineHeight: '22px'
        }
    },
    ClaimText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 16,
        color: '#FFF',
        marginTop: 46,
        marginBottom: 42,
        textAlign: 'center',
        "@media (max-width: 1100px)": {
            marginTop: 20,
            marginBottom: 20,
            fontSize: 12
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

const ClaimCard = ({ userData, initFunc }) => {
    const classes = useStyles();
    const { addToast } = useToasts();

    const authData = useSelector((state) => state.authentication);
    const currency = { coinType: 'ZELO' };

    const claimCommission = 0.3;
    const [claimAmount, setClaimAmount] = useState(0);

    useEffect(() => {
        let amount = 0;
        // eslint-disable-next-line
        userData.map((data) => {
            let wargerData = data.wargerData;
            if (wargerData.length > 0) {
                let totalWarger = wargerData[0].totalWargerAmount;
                let claimedAmount = Number(wargerData[0].campaignClaimAmount ? wargerData[0].campaignClaimAmount : 0);
                let availableAmount = (totalWarger - claimedAmount) / 100 * claimCommission;
                if (availableAmount > 0) amount += availableAmount;
            }
        });
        setClaimAmount(amount);
        // eslint-disable-next-line
    }, [userData]);

    const handleClaim = async () => {
        if (authData.isAuth && claimAmount > 0) {
            const response = await claimCampaignAmount({ userId: authData.userData._id, type: 'default' });
            if (response.status) {
                addToast(`${claimAmount} claimed successfully!`, { appearance: 'success', autoDismiss: true });
                initFunc();
            }
        }
    };

    return (
        <Box className={classes.CardLayout}>
            <Box className={classes.CardTitleBox}>
                <img className={classes.CardTitleIcon} src={TournamentsIcon} alt="icon" />
                <span className={classes.CardTitleText}>Available to claim</span>
            </Box>
            <Box className={classes.AmountBox}>
                <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt={currency?.coinType} />
                <span className={classes.AmountText}>{claimAmount.toFixed(4)}</span>
            </Box>
            <Typography className={classes.ClaimText}>Total to claim</Typography>
            <Button className={classes.SubmitButton} onClick={handleClaim}>Claim</Button>
        </Box>
    );
};

export default ClaimCard;