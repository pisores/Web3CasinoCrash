import { Box, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DepositBonusCard from "./DespoitCards/BonusCard";
import UnLockerCard from "./DespoitCards/UnLockerCard";
import FreeSpinCard from "./DespoitCards/FreeSpinCard";
import RechargeCard from "./DespoitCards/RechargeCard";
import PromotionCodeCard from "./DespoitCards/PromotionCodeCard";
import SubscribeCard from "./DespoitCards/SubscribeCard";
import JackpotCard from "./DespoitCards/JackpotCard";
import { useEffect, useState } from "react";
import { getDepositBonus } from "redux/actions/auth";
import clsx from "clsx";
import TournamentCard from "./ClaimCards/TurnamentCard";
import RainCard from "./ClaimCards/RainCard";
import GivewayCard from "./ClaimCards/GiveawayCard";
import GiftCard from "./ClaimCards/GiftCard";
import BonusBannerIcon1 from "assets/icons/BonusBannerIcon1.png";
import BonusBannerIcon2 from "assets/icons/BonusBannerIcon2.png";
import BonusBannerIcon3 from "assets/icons/BonusBannerIcon3.png";
import BonusBannerIcon4 from "assets/icons/BonusBannerIcon4.png";

const useStyles = makeStyles(() => ({
    RootContainer: {
        width: '100%',
        height: '100%'
    },
    CarouselBox: {
        width: '100%',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            padding: '0px 14px'
        }
    },
    BannerBox: {
        backgroundImage: 'url(/assets/images/banner-bg.png)',
        backgroundPosition: '26% 50%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: '#FFF',
        borderRadius: '30px',
        height: '362px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        "@media (max-width: 681px)": {
            height: '164px',
            borderRadius: '10px'
        }
    },
    BonusBannerBox: {
        backgroundImage: 'url(/assets/images/bonus-banner.png)',
        marginTop: '65px',
        height: '349px'
    },
    BannerCharacter: {
        width: '563px',
        height: '483px',
        position: 'absolute',
        left: '680px',
        bottom: '-63px',
        "@media (max-width: 681px)": {
            width: '197px',
            right: '0px',
            left: 'unset',
            bottom: '0px',
            height: 'auto'
        }
    },
    BannerTextBox: {
        display: 'flex',
        flexDirection: 'column',
        width: '515px',
        position: 'absolute',
        left: '97px',
        top: '40px',
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            width: '221px',
            padding: '0px 20px',
            top: '10px',
            left: ''
        }
    },
    BannerTitle: {
        fontFamily: 'Styrene A Web',
        fontWeight: '900',
        fontSize: "49.391px",
        lineHeight: "63px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        textShadow: "-6.73513px 6.73513px 0px rgba(0, 0, 0, 0.25)",
        "&>span": {
            fontFamily: 'Styrene A Web',
            color: '#FED847'
        },
        "@media (max-width: 681px)": {
            fontSize: '18px',
            lineHeight: '23px'
        }
    },
    BannerText: {
        fontFamily: 'Styrene A Web',
        fontWeight: '400',
        fontSize: "24px",
        lineHeight: "33px",
        color: "#FFFFFF",
        "@media (max-width: 681px)": {
            fontSize: '13px',
            lineHeight: '17px'
        }
    },
    GameListBox: {
        marginTop: '34px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: "900",
            fontSize: "32px",
            lineHeight: "41px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            opacity: "0.5",
            textShadow: "-8.08791px 8.08791px 0px rgba(0, 0, 0, 0.25)",
            "@media (max-width: 681px)": {
                fontSize: '19px',
                lineHeight: '24px'
            }
        }
    },
    BounsList: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '20px',
        marginTop: '30px',
        flexWrap: 'wrap'
    },
    ClaimList: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '24px',
        marginTop: '30px',
        overflow: 'auto',
        padding: '24px',
        border: 'solid 1px #363646',
        borderRadius: '8px'
    },
    BannerIconsBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        "@media (max-width: 681px)": {
            "&>img": {
                width: '40px',
                height: '40px'
            }
        }
    },
    BannerIconBox: {
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        border: '10px solid #9371EE',
        borderRadius: '50%',
        "@media (max-width: 681px)": {
            width: '40px',
            height: '40px',
            border: '5px solid #9371EE',
            "&>img": {
                width: '22px',
                height: '22px'
            }
        }
    }
}));

const BonusLayout = () => {
    const classes = useStyles();

    const [depositBonusData, setDepositBonusData] = useState([
        {
            minDeposit: 30,
            percents: [120, 150, 270]
        },
        {
            minDeposit: 60,
            percents: [150, 220, 300]
        },
        {
            minDeposit: 120,
            percents: [170, 250, 330]
        },
        {
            minDeposit: 150,
            percents: [190, 270, 360]
        }
    ]);

    useEffect(() => {
        initFunc();
    }, []);

    const initFunc = async () => {
        const response = await getDepositBonus();
        if (response.status) {
            let bonusData = [
                {
                    minDeposit: 30,
                    percents: [120, 150, 270]
                },
                {
                    minDeposit: 60,
                    percents: [150, 220, 300]
                },
                {
                    minDeposit: 120,
                    percents: [170, 250, 330]
                },
                {
                    minDeposit: 150,
                    percents: [190, 270, 360]
                }
            ];
            if (response.data) {
                // eslint-disable-next-line
                response.data.map((item, index) => {
                    let percentIndex = item.amountLevel === 'Low' ? 0 :
                        item.amountLevel === 'Medium' ? 1 : 2;
                    if (item.amountLevel === 'Low') {
                        bonusData[item.depositCount - 1].minDeposit = item.startAmount;
                    }
                    bonusData[item.depositCount - 1].percents[percentIndex] = item.percent;
                });
            }
            setDepositBonusData([...bonusData]);
        }
    };

    return (
        <Box className={classes.RootContainer}>
            <Box className={classes.CarouselBox}>
                <Box className={classes.BannerBox}>
                    <img className={classes.BannerCharacter} src="/assets/images/BonusPageCharacter.png" alt="banner-character" />
                    <Box className={classes.BannerTextBox}>
                        <Box className={classes.BannerIconsBox}>
                            <img src={BonusBannerIcon1} alt="icon" width="84px" height="84px" />
                            <img src={BonusBannerIcon2} alt="icon" width="84px" height="84px" />
                            <img src={BonusBannerIcon3} alt="icon" width="84px" height="84px" />
                            <img src={BonusBannerIcon4} alt="icon" width="84px" height="84px" />
                        </Box>
                        <Box className={classes.BannerTitle}>Promotions &</Box>
                        <Box className={classes.BannerTitle}><span>Bonuses</span></Box>
                        <span className={classes.BannerText}>Supercharge your winnings with some extra swag</span>
                    </Box>
                </Box>
                <Box className={classes.GameListBox}>
                    <span>Available to claim</span>
                    <Box className={clsx(classes.ClaimList, "NoScroll")}>
                        <TournamentCard locked={false} />
                        <RainCard locked={true} />
                        <GivewayCard locked={true} />
                        <GiftCard locked={true} />
                        <TournamentCard locked={true} />
                        <RainCard locked={true} />
                        <GivewayCard locked={true} />
                        <GiftCard locked={true} />
                    </Box>
                </Box>
                <Box className={classes.GameListBox}>
                    <span>Deposit bonus</span>
                    <Box className={classes.BounsList}>
                        <DepositBonusCard cardNumber={1} {...depositBonusData[0]} active={true} />
                        <DepositBonusCard cardNumber={2} {...depositBonusData[1]} active={false} />
                        <DepositBonusCard cardNumber={3} {...depositBonusData[2]} active={false} />
                        <DepositBonusCard cardNumber={4} {...depositBonusData[3]} active={false} />
                    </Box>
                    <Divider sx={{ mt: 6, mb: 6, borderColor: '#2A2A35' }} />
                    <Box className={classes.BounsList}>
                        <UnLockerCard />
                        <FreeSpinCard />
                        <RechargeCard />
                        <PromotionCodeCard />
                        <SubscribeCard />
                        <JackpotCard />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BonusLayout; 