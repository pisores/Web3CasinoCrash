import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TournamentCard from "./TournamentCard";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "layout/Context/loading";
import { getTournamentList, participateTournament } from "redux/actions/auth";
import { KeyboardBackspace } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import TournamentTable from "./TournamentTable";

const useStyles = makeStyles(() => ({
    MainLayout: {
        width: '100%',
        paddingRight: 50,
        "@media (max-width: 940px)": {
            // paddingRight: 0,
            padding: '0px 10px'
        }
    },
    BannerBox: {
        width: '100%',
        height: 362,
        backgroundImage: 'url("/assets/images/tournament/banner.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
        "@media (max-width: 940px)": {
            borderRadius: 0,
            height: 250
        }
    },
    BannerCharacter: {
        width: 480,
        position: 'absolute',
        bottom: -63,
        right: 'calc((100% - 385px) / 2 - 430px)',
        "@media (max-width: 1240px)": {
            width: 300,
            right: -50,
            bottom: 20
        },
        "@media (max-width: 940px)": {
            bottom: -20
        }
    },
    BannerTextBox: {
        width: 766,
        left: 97,
        top: 45,
        position: 'absolute',
        "@media (max-width: 1240px)": {
            left: 27,
            width: 400
        },
        "@media (max-width: 440px)": {
            width: 250
        }
    },
    TournamentCupIcon: {
        width: 84,
        height: 84,
        "@media (max-width: 1240px)": {
            width: 54,
            height: 54
        }
    },
    BannerMainText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 900,
        fontSize: 48,
        lineHeight: '61px',
        textTransform: 'uppercase',
        color: '#FFF',
        textShadow: '6px 6px 0px rgba(0, 0, 0, 0.25)',
        marginBottom: 16,
        marginTop: 6,
        "@media (max-width: 1240px)": {
            fontSize: 28,
            lineHeight: '32px'
        },
        "@media (max-width: 440px)": {
            fontSize: 18,
            lineHeight: '22px'
        }
    },
    BannerSubText: {
        fontFamily: 'Styrene A Web',
        fontWeight: 400,
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        "@media (max-width: 1240px)": {
            fontSize: 12,
            lineHeight: '14px'
        }
    },
    PageTitleBox: {
        display: 'flex',
        gap: 28,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 34
    },
    PageTitleText: {
        color: 'rgba(255, 255, 255, 0.5)',
        textTransform: 'uppercase',
        fontFamily: 'Styrene A Web',
        fontWeight: 900,
        fontSize: 32,
        lineHeight: '41px',
        textShadow: '-8px 8px 0px rgba(0, 0, 0, 0.25)'
    },
    MainDataBox: {
        padding: '19px 21px 40px',
        border: '1px solid #363646',
        borderRadius: 8,
        marginTop: 25
    },
    MainDataTitleText: {
        fontFamily: 'Cera Pro',
        fontWeight: 400,
        fontSize: 14,
        lineHeight: '18px',
        color: '#FFF',
        marginBottom: 21
    },
    DetailHeaderBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        marginTop: 30
    },
    BackspaceIcon: {
        width: 52,
        height: 36,
        borderRadius: 8,
        background: '#2C2C3A',
        color: '#FFF'
    },
    DetailTitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        textShadow: '-8px 8px 0px rgba(0, 0, 0, 0.25)',
        fontFamily: 'Styrene A Web',
        fontWeight: 900,
        fontSize: 28,
        lineHeight: '32px',
        textTransform: 'uppercase'
    },
    DetailDataBox: {
        marginTop: 20,
        width: '100%',
        padding: 22,
        border: 'solid 1px #363646',
        borderRadius: 8
    },
    PrizeBox: {
        width: '100%'
    },
    PrizeTitleBox: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "&>span": {
            fontFamily: 'Cera Pro',
            fontWeight: 700,
            fontSize: 14,
            lineHeight: '18px',
            color: '#FFF',
            textTransform: 'uppercase'
        }
    },
    PrizeDataBox: {
        width: '100%',
        background: '#424253',
        borderRadius: 8,
        padding: '25px 28px',
        marginTop: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    BalanceBox: {
        width: 166,
        height: 43,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: '#2C2C3A',
        borderRadius: 8
    },
    CardCurrencyIcon: {
        width: 32,
        height: 32
    },
    CardAmount: {
        fontFamily: 'Styrene A Web',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: '23px',
        textTransform: 'uppercase',
        color: '#FFF'
    },
    DetailBox: {
        width: '100%',
        background: '#424253',
        borderRadius: 8,
        padding: '25px 28px',
        marginTop: 24
    },
    NameBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15
    },
    DetailIcon: {
        width: 99,
        height: 99
    },
    CardNameText: {
        fontFamily: 'Cera Pro',
        fontWeight: 700,
        fontSize: 17,
        lineHeight: '21px',
        color: '#FFF'
    },
    ProgressBox: {
        background: '#2C2C3A',
        width: 93,
        height: 27,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6
    },
    DetailDescription: {
        fontFamily: 'Styrene A Web',
        fontWeight: 100,
        fontSize: 16,
        color: '#FFF',
        marginTop: 25
    },
    EndingBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        "&>span": {
            fontFamily: 'Cera Pro',
            fontWeight: 700,
            fontSize: 14,
            color: '#FFF'
        }
    },
    ParticipateButton: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: 8,
        padding: '14px 23px',
        fontFamily: 'Styrene A Web',
        fontSize: 14,
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#FFF'
    },
    ActionBox: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 20
    }
}));

const PAGE_TYPE = {
    LIST: 0,
    DETAIL: 1
};

const TournamentContainer = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const { addToast } = useToasts();
    const authData = useSelector((state) => state.authentication);

    const [pageType, setPageType] = useState(PAGE_TYPE.LIST);
    const [tournamentList, setTournamentList] = useState([]);
    const [tournamentDetail, setTournamentDetail] = useState(null);
    const [participated, setParticipated] = useState(false);

    useEffect(() => {
        if (pageType === PAGE_TYPE.LIST) {
            initFunc();
        }
        // eslint-disable-next-line
    }, [pageType]);

    useEffect(() => {
        if (tournamentDetail !== null && authData.isAuth) {
            let userIndex = tournamentDetail.users.findIndex((item) => item.userId === authData.userData._id);
            if (userIndex >= 0) {
                setParticipated(true);
            }
            else {
                setParticipated(false);
            }
        }
        // eslint-disable-next-line
    }, [tournamentDetail]);

    const initFunc = async () => {
        showLoading();
        const response = await getTournamentList();
        if (response.status) {
            setTournamentList(response.data);
        }
        hideLoading();
    };

    const handleDetail = (index) => {
        setTournamentDetail(tournamentList[index]);
        setPageType(PAGE_TYPE.DETAIL);
    };

    const handleBackspace = () => {
        setPageType(PAGE_TYPE.LIST);
    };

    const calcProgress = (startDate) => {
        if (new Date(startDate).getTime > new Date().getTime()) return 'Upcoming';
        else return 'In progress'
    };

    const getPeriod = (startDate, endDate) => {
        const date1 = new Date(endDate);
        const date2 = new Date(startDate);

        // Calculate the difference in milliseconds
        const diffInMs = date1.getTime() - date2.getTime();

        // Convert the difference to days
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays;
    };

    const handleParticipate = async () => {
        if (authData.isAuth) {
            const request = {
                userId: authData.userData._id,
                tournamentId: tournamentDetail._id
            };

            const response = await participateTournament(request);
            if (response.status) {
                addToast('Successfully saved!', { appearance: 'success', autoDismiss: true });
                setParticipated(true);
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    }

    return (
        <Box className={classes.MainLayout}>
            <Box className={classes.BannerBox}>
                <img src={`/assets/images/tournament/banner-character.png`} alt="banner character" className={classes.BannerCharacter} />
                <Box className={classes.BannerTextBox}>
                    <img src={`/assets/images/tournament/cup.png`} alt="cup" className={classes.TournamentCupIcon} />
                    <Typography className={classes.BannerMainText}>Become a crypto Champion and win big!</Typography>
                    <Typography className={classes.BannerSubText}>Get a huge piece of the stunning $10,000 pool prize every week!</Typography>
                </Box>
            </Box>
            {
                pageType === PAGE_TYPE.LIST ?
                    <Box>
                        <Box className={classes.PageTitleBox}>
                            <img src={`/assets/images/tournament/cup.png`} alt="cup" className={classes.TournamentCupIcon} />
                            <span className={classes.PageTitleText}>Tournaments</span>
                        </Box>
                        <Box className={classes.MainDataBox}>
                            <Typography className={classes.MainDataTitleText}>Become a top thick-skinned player and get a chance to participate regularly in the toumaments. Enjoy a more significant pie by scoring a split in massive pool prizes.</Typography>
                            {
                                tournamentList.map((item, index) => (
                                    <TournamentCard key={index} {...item} index={index} onClick={handleDetail} />
                                ))
                            }
                        </Box>
                    </Box>
                    :
                    <Box>
                        <Box className={classes.DetailHeaderBox}>
                            <IconButton className={classes.BackspaceIcon} onClick={handleBackspace}>
                                <KeyboardBackspace />
                            </IconButton>
                            <span className={classes.DetailTitle}>
                                Tournament Details
                            </span>
                        </Box>
                        <Box className={classes.DetailDataBox}>
                            <Box className={classes.PrizeBox}>
                                <Box className={classes.PrizeTitleBox}>
                                    <span>Bonus</span>
                                    <span>Ending</span>
                                </Box>
                                <Box className={classes.PrizeDataBox}>
                                    <Box className={classes.BalanceBox}>
                                        <img className={classes.CardCurrencyIcon} src={`/assets/images/coins/${tournamentDetail.prizePoolCoinType.toLowerCase()}.png`} alt={tournamentDetail.prizePoolCoinType} />
                                        <span className={classes.CardAmount}>{Number(tournamentDetail.prizePoolAmount).toFixed(2)}</span>
                                    </Box>
                                </Box>
                                <Box className={classes.DetailBox}>
                                    <Box className={classes.NameBox}>
                                        <Avatar src={`/assets/images/tournament/01.png`} alt="icon" className={classes.DetailIcon} />
                                        <Box>
                                            <span className={classes.CardNameText}>{tournamentDetail.name}</span>
                                            <Box className={classes.ProgressBox} style={calcProgress(tournamentDetail.startDate) === 'In progress' ? { color: '#6FE482' } : { color: '#FED847' }}>
                                                {
                                                    calcProgress(tournamentDetail.startDate)
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Typography className={classes.DetailDescription}>{tournamentDetail.description}</Typography>
                                    <Box className={classes.EndingBox}>
                                        <span>Ending</span>
                                        <span>Duration</span>
                                    </Box>
                                    <Box className={classes.EndingBox}>
                                        <span>{`In ${getPeriod(tournamentDetail.startDate, tournamentDetail.endDate)} days`}</span>
                                        <span>{`${getPeriod(tournamentDetail.startDate, tournamentDetail.endDate) * 24} hours`}</span>
                                    </Box>
                                </Box>
                                <Box className={classes.ActionBox}>
                                    {
                                        !participated &&
                                        <Button className={classes.ParticipateButton} onClick={handleParticipate}>Participate</Button>
                                    }
                                </Box>
                                <Box className={classes.PlayerTableBox}>
                                    <TournamentTable
                                        userData={tournamentDetail.users}
                                        userDetail={tournamentDetail.userData}
                                        startDate={tournamentDetail.startDate}
                                        endDate={tournamentDetail.endDate}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
            }

        </Box>
    );
};

export default TournamentContainer;