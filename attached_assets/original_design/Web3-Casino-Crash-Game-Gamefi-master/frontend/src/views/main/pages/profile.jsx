import { Avatar, Box, Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Close } from "@mui/icons-material";
import { ReactComponent as MenuTopIcon } from "assets/icons/MenuTop.svg";
import { ReactComponent as UserAvatarIcon } from "assets/icons/UserAvatar.svg";
import { ReactComponent as LevelInfoIcon } from "assets/icons/LevelInfoIcon.svg";
import { ReactComponent as ProfileSettingIcon } from "assets/icons/ProfileSettingIcon.svg";
import { ReactComponent as CoinIcon } from "assets/icons/CoinIcon.svg";
import { ReactComponent as ProfileOptionIcon } from "assets/icons/ProfileOption.svg";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileData, updateProfileHistory } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles(() => ({
    ProfileWidgetBox: {
        width: '488px',
        height: '691px',
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: '10px 0px 0px 10px',
        padding: '4px 0px 0px 5px',
        "@media (max-width: 681px)": {
            width: '100vw',
            padding: '4px 0px 0px 0px',
            borderRadius: '0px'
        }
    },
    ProfileContainer: {
        width: '483px',
        height: '687px',
        borderRadius: '10px 0px 0px 10px',
        background: '#2C2C3A',
        border: '1px solid #4F4F5C',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '27px 25px 24px 30px',
        gap: '23px',
        "@media (max-width: 681px)": {
            width: '100%',
            borderRadius: '0px'
        }
    },
    TopIconBox: {
        position: 'absolute',
        top: '-16px',
        right: '66px',
        "@media (max-width: 681px)": {
            display: 'none'
        }
    },
    CloseIconBox: {
        zIndex: '2',
        position: 'absolute',
        color: '#55556F',
        right: '16px',
        top: '15px',
        "&>svg": {
            cursor: 'pointer'
        },
        "&>button>svg": {
            color: '#55556F'
        },
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            right: 'unset',
            left: '50%',
            top: '-35px',
            width: '64px',
            height: '64px',
            color: '#55556F',
            background: '#2C2C3A',
            border: '6px solid #24252D',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            "&>svg": {
                width: '30px',
                height: '30px'
            }
        }
    },
    ProfileOptionBox: {
        zIndex: '2',
        position: 'absolute',
        color: '#55556F',
        right: '11px',
        top: '50px',
        "&>svg": {
            cursor: 'pointer'
        }
    },
    UserInfoBox: {
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
        width: '100%'
    },
    UserAvatarBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '11px',
        position: 'relative'
    },
    UserDetailBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0px",
        gap: "2.89px"
    },
    UserNameText: {
        fontFamily: "Cera Pro",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "26px",
        color: "#FFFFFF"
    },
    UserLevelText: {
        fontFamily: "Cera Pro",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textTransform: "uppercase",
        color: "#6FE482"
    },
    UserLevelInfoIconBox: {
        position: 'absolute',
        left: '255px',
        top: '30px',
        cursor: 'pointer'
    },
    ProfileSettingBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "6px"
    },
    SettingText: {
        border: "1px solid #363646",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "117px",
        height: "32px",
        fontFamily: 'Styrene A Web',
        fontSize: '12px',
        textTransform: 'uppercase',
        fontWeight: '700'
    },
    SettingButton: {
        width: "32px",
        minWidth: "32px",
        padding: "0px",
        height: "32px",
        background: "#1F1E25",
        border: "1px solid #363646",
        borderRadius: "4px"
    },
    FollowingBox: {
        display: 'flex',
        gap: '21px',
        fontFamily: 'Cera Pro',
        "&>span": {
            color: '#95959C',
            fontWeight: '400',
            fontSize: '15px',
            lineHeight: '19px',
            "&>label": {
                color: '#FFF',
                fontWeight: '700',
                fontSize: '21px',
                lineHeight: '26px'
            }
        }
    },
    DetailBox: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '12px'
    },
    MemberSinceBox: {
        width: '100%',
        height: '39px',
        border: 'solid 1px #424253',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '16px',
        borderRadius: '7px',
        fontFamily: 'Styrene A Web',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '13px',
        lineHeight: '17px'
    },
    AmountDetailBox: {
        display: 'flex',
        gap: '10px',
        width: '100%'
    },
    AmountBox: {
        width: '100%',
        height: '70px',
        border: '1px solid #424253',
        borderRadius: '7px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        padding: '11px 10px 10px 16px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "13px",
            lineHeight: "17px",
            color: "#95959C"
        }
    },
    AmountLabel: {
        fontFamily: "'Cera Pro'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "26px",
        color: "#FFFFFF",
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '10px'
    },
    HistoryBox: {
        width: '100%',
        gap: '14px',
        display: 'flex',
        flexDirection: 'column'
    },
    HistoryTabBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    TabButton: {
        width: "135px",
        height: "41px",
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "18px",
        textAlign: "center",
        textTransform: "uppercase",
        borderRadius: "8px",
        color: "#FFFFFF",
        opacity: '0.5'
    },
    ActiveButton: {
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        opacity: '1'
    },
    HistoryDataBox: {
        display: 'flex',
        flexDirection: 'column'
    },
    TableHeaderBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0px 10px',
        "&>div": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "10px",
            lineHeight: "13px",
            textTransform: "uppercase",
            color: "#95959C"
        }
    },
    TableDataBox: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '247px',
        overflow: 'auto'
    },
    NoResultBox: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '14px',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "20px",
            textAlign: "center",
            textTransform: "uppercase",
            color: "#95959C"
        }
    },
    ProfileOptionWidget: {
        position: 'absolute',
        top: '100px',
        right: '11px',
        width: "220px",
        height: "280px",
        background: "#424253",
        border: "1px solid #4F4F5C",
        borderRadius: "8px 0px 0px 8px",
        zIndex: '2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px'
    },
    ProfileOptionButton: {
        width: "100%",
        height: "45px",
        background: "#2C2C3A",
        borderRadius: "8px",
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "20px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    ResultBox: {
        width: '100%',
        display: 'flex',
        gap: '5px',
        flexDirection: 'column',
        paddingTop: '10px'
    },
    UserBetHistoryRow: {
        height: '52px',
        width: '100%',
        backgroundColor: '#1f1e25',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        padding: '0px 10px'
    },
    FlexBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        "&>span": {
            fontFamily: 'Styrene A Web',
            fontWeight: '700',
            fontSize: '14px',
            lineHeight: '18px',
            textTransform: 'uppercase',
            color: '#FFF'
        }
    },
    WinSpan: {
        color: '#6FE482 !important'
    },
    LostSpan: {
        color: 'red !important'
    }
}));

let HistoryStep = 0;

const ProfileWidget = ({ closeProfileMenu, setSignoutModal, handleUserSetting }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const profileButtonRef = useRef();
    const profileWidgetRef = useRef();

    const editSettingRef = useRef();
    const menuSettingRef = useRef();

    const historyRef = useRef(null);

    const authData = useSelector((state) => state.authentication);
    const [profileData, setProfileData] = useState(undefined);

    const [activeTab, setActiveTab] = useState(0);
    const [profileOption, setProfileOption] = useState(false);
    const [updatedHistoryData, setUpdatedHistoryData] = useState(null);

    useEffect(() => {
        initFunc();
        document.addEventListener('click', handleClickOutside);
        historyRef.current.addEventListener('scroll', handleScrollEvent);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (updatedHistoryData !== null) {
            HistoryStep++;
            let betHistoryData = [...profileData.betHistoryData, ...updatedHistoryData];
            setProfileData({ ...profileData, betHistoryData });
        }
        // eslint-disable-next-line
    }, [updatedHistoryData]);

    const initFunc = async () => {
        if (authData.isAuth) {
            const response = await getProfileData({ userId: authData.userData._id });
            if (response.status) {
                setProfileData(response.data);
                HistoryStep++;
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    };

    const handleClickOutside = (e) => {
        if (profileWidgetRef.current && !profileWidgetRef.current.contains(e.target)) {
            if (profileButtonRef.current && !profileButtonRef.current.contains(e.target)) {
                setProfileOption(false);
            }
        }
    };

    const handleCloseMenu = () => {
        closeProfileMenu();
    };

    const handleActiveTab = (data) => {
        setActiveTab(data);
    };

    const handleProfileOption = () => {
        setProfileOption(!profileOption);
    };

    const handleSignout = () => {
        setSignoutModal(true);
    };

    const handleLevelInfo = () => {
        dispatch({ type: 'SET_LEVEL_MODAL', data: true });
        closeProfileMenu();
    };

    const handleScrollEvent = async () => {
        const { scrollTop, scrollHeight, clientHeight } = historyRef.current;
        if (scrollTop + clientHeight === scrollHeight) {
            const request = {
                step: HistoryStep,
                userId: authData.userData._id
            };
            const response = await updateProfileHistory(request);
            if (response.status) {
                setUpdatedHistoryData(response.data);
            }
        }
    };

    const setPrivacyModalOpen = (flag) => {
        dispatch({ type: 'SET_PRIVACY_MODAL', data: flag });
    };

    return (
        <Box className={classes.ProfileWidgetBox}>
            <Box className={classes.ProfileContainer}>
                <Box className={classes.TopIconBox}>
                    <MenuTopIcon />
                </Box>
                <Box className={classes.CloseIconBox}>
                    <IconButton onClick={handleCloseMenu}>
                        <Close />
                    </IconButton>
                </Box>
                <Box className={classes.ProfileOptionBox}>
                    <IconButton onClick={handleProfileOption} ref={profileButtonRef}>
                        <ProfileOptionIcon />
                    </IconButton>
                </Box>
                {
                    profileOption &&
                    <Box className={classes.ProfileOptionWidget} ref={profileWidgetRef}>
                        <Button className={classes.ProfileOptionButton} onClick={() => setPrivacyModalOpen(true)}>Privacy</Button>
                        <Button className={classes.ProfileOptionButton}>Blocked Users</Button>
                        <Button className={classes.ProfileOptionButton}>Self Exclusion</Button>
                        <Button className={classes.ProfileOptionButton} onClick={() => handleUserSetting(true)} ref={menuSettingRef}>Settings</Button>
                        <Button className={classes.ProfileOptionButton} onClick={handleSignout}>Sign Out</Button>
                    </Box>
                }
                <Box className={classes.UserInfoBox}>
                    <Box className={classes.UserAvatarBox}>
                        <UserAvatarIcon />
                        <Box className={classes.UserDetailBox}>
                            <span className={classes.UserNameText}>{profileData?.userData?.userNickName}</span>
                            <span className={classes.UserLevelText}>Advenrturer - LV{profileData?.userData?.userLevel}</span>
                            <Box className={classes.ProfileSettingBox}>
                                <Box className={classes.SettingText}>Edit Profile</Box>
                                <Button className={classes.SettingButton} onClick={() => handleUserSetting(true)} ref={editSettingRef}><ProfileSettingIcon /></Button>
                            </Box>
                        </Box>
                        <Box className={classes.UserLevelInfoIconBox} onClick={handleLevelInfo}>
                            <LevelInfoIcon />
                        </Box>
                    </Box>
                    <Box className={classes.FollowingBox}>
                        <span><label>{profileData?.followData?.followers}</label> Followers</span>
                        <span><label>{profileData?.followData?.following}</label> Following</span>
                    </Box>
                    <Box className={classes.DetailBox}>
                        <Box className={classes.MemberSinceBox}>Member since {profileData ? new Intl.DateTimeFormat('en-US', { year: "numeric", month: "long" }).format(new Date(profileData?.userData?.createdAt)) : ''}</Box>
                        <Box className={classes.AmountDetailBox}>
                            <Box className={classes.AmountBox}>
                                <span>Bets</span>
                                <Box className={classes.AmountLabel}>{profileData ? profileData?.countData?.betCount : 0}</Box>
                            </Box>
                            <Box className={classes.AmountBox}>
                                <span>Wargered</span>
                                <Box className={classes.AmountLabel}>
                                    <CoinIcon />
                                    {profileData ? Number(profileData?.countData?.betAmount).toFixed(3) : 0}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.HistoryBox}>
                    <Box className={classes.HistoryTabBox}>
                        <Button
                            className={clsx(classes.TabButton, activeTab === 0 ? classes.ActiveButton : '')}
                            onClick={() => handleActiveTab(0)}
                        >
                            All
                        </Button>
                        <Button
                            className={clsx(classes.TabButton, activeTab === 1 ? classes.ActiveButton : '')}
                            onClick={() => handleActiveTab(1)}
                        >
                            Big Wins
                        </Button>
                        <Button
                            className={clsx(classes.TabButton, activeTab === 2 ? classes.ActiveButton : '')}
                            onClick={() => handleActiveTab(2)}
                        >
                            Lucky Wins
                        </Button>
                    </Box>
                    <Box className={classes.HistoryDataBox}>
                        <Box className={classes.TableHeaderBox}>
                            <Box sx={{ width: '30%', textAlign: 'left' }}>Date</Box>
                            <Box sx={{ width: '25%', textAlign: 'center' }}>Bet</Box>
                            <Box sx={{ width: '25%', textAlign: 'center' }}>Payout/Lost</Box>
                            <Box sx={{ width: '20%', textAlign: 'right' }}>Game</Box>
                        </Box>
                        <Box className={clsx(classes.TableDataBox, 'NoScroll')} ref={historyRef}>
                            {
                                profileData?.betHistoryData.length > 0 ?
                                    <Box className={classes.ResultBox}>
                                        {
                                            profileData?.betHistoryData.map((data, index) => {
                                                return (
                                                    <Box key={index} className={classes.UserBetHistoryRow}>
                                                        <Box
                                                            sx={{
                                                                width: '30%',
                                                                textAlign: 'left',
                                                                color: '#FFF'
                                                            }}
                                                        >
                                                            {new Intl.DateTimeFormat('en-US').format(new Date(data.date))}
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                width: '25%',
                                                                textAlign: 'center'
                                                            }}
                                                            className={classes.FlexBox}
                                                        >
                                                            <Avatar
                                                                alt={data.coinType.coinType}
                                                                src={`/assets/images/coins/${data.coinType.coinType.toLowerCase()}.png`}
                                                                sx={{ width: 14, height: 14 }}
                                                            />
                                                            <span>{data.betAmount}</span>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                width: '25%',
                                                                textAlign: 'center'
                                                            }}
                                                            className={classes.FlexBox}
                                                        >
                                                            <Avatar
                                                                alt={data.coinType.coinType}
                                                                src={`/assets/images/coins/${data.coinType.coinType.toLowerCase()}.png`}
                                                                sx={{ width: 14, height: 14 }}
                                                            />
                                                            <span
                                                                className={
                                                                    data.roundResult === 'win' || data.roundResult === 'payout' ? classes.WinSpan
                                                                        : data.roundResult === 'lost' ? classes.LostSpan
                                                                            : ''
                                                                }
                                                            >
                                                                {
                                                                    (data.roundResult === 'win' || data.roundResult === 'payout') ? (data.betAmount * data.payout).toFixed(2)
                                                                        : data.roundResult === 'draw' || data.roundResult === 'finish' ? data.betAmount.toFixed(2) : `-${data.betAmount.toFixed(2)}`
                                                                }
                                                            </span>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                width: '20%',
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            <img alt='icon' src={`/assets/images/games/${data.gameType}.png`} width="20px" />
                                                        </Box>
                                                    </Box>
                                                );
                                            })
                                        }
                                    </Box>
                                    :
                                    <Box className={classes.NoResultBox}>
                                        <img src={"/assets/images/empty.png"} alt="image1" />
                                        <span>No Result Found</span>
                                    </Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfileWidget;