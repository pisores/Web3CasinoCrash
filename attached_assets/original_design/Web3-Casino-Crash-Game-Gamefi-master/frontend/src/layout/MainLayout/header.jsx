import { makeStyles } from "@mui/styles";
import { Box, Button, FormControl, IconButton, MenuItem, Select } from "@mui/material";
import AuthenticationModal from "views/main/modals/AuthModal";
import WalletModal from "views/main/modals/WalletModal";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as MenuCollapeIcon } from "assets/icons/MenuCollaps.svg";
import { ReactComponent as MobileMenuCollapeIcon } from "assets/icons/mobile-menu.svg";
import { ReactComponent as LogoIcon } from "assets/icons/Logo.svg";
import { ReactComponent as AlarmIcon } from "assets/icons/AlarmIcon.svg";
import { ReactComponent as ChatIcon } from "assets/icons/ChatIcon.svg";
import { ReactComponent as SystemMessageIcon } from "assets/icons/MessageIcon.svg";
import { ReactComponent as ProfileIcon } from "assets/icons/ProfileIcon.svg";
import { ReactComponent as StarIcon } from "assets/icons/StarIcon.svg";
import { ReactComponent as MobileWalletIcon } from "assets/icons/mobile-wallet.svg";
import ProfileWidget from "views/main/pages/profile";
import ChatWidget from "views/main/pages/chat";
import SignoutModal from "views/main/modals/SignoutModal";
import UserSetting from "views/main/pages/userSetting";
import MenuModal from "views/main/modals/MenuModal";
import LevelModal from "views/main/modals/LevelModal";
import MessageIcon from "assets/icons/chaticon.png";
import FreeSpinModal from "views/main/modals/FreeSpinModal";
import { updateCurrency } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";
import SettingModal from "views/main/modals/SettingModal";
import FairModal from "views/main/modals/FairModal";
import { getCurrencies } from "redux/actions/payment";
import PrivacyModal from "views/main/modals/PrivacyModal";

const useStyles = makeStyles(() => ({
    MainHeaderBox: {
        width: '100%',
        padding: '30px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        background: '#1f1e25',
        zIndex: '10',
        "@media (max-width: 681px)": {
            padding: '8px 14px'
        }
    },
    LogoBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '21px'
    },
    LogoIcon: {
        "@media (max-width: 1024px)": {
            display: 'none'
        }
    },
    MenuIconButton: {
        color: '#FFF',
        background: 'transparent',
        width: '26px',
        height: '16px',
        "@media (max-width: 681px)": {
            display: 'none'
        }
    },
    MobileMenuIconButton: {
        display: 'none',
        "@media (max-width: 681px)": {
            display: 'block',
            width: '50px',
            height: '47px'
        }
    },
    LoginBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: "5px"
    },
    HeaderButton: {
        padding: '0px 1rem',
        borderRadius: '0.5rem',
        height: '40px',
        "&>span": {
            textTransform: 'uppercase',
            fontWeight: '600',
            fontSize: '14px',
            "@media (max-width: 764px)": {
                fontSize: '12px'
            }
        }
    },
    CustomizeButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px 23px",
        gap: "10px",
        width: "115px",
        height: "47px",
        background: "#2C2C3A",
        border: "1px solid #363646",
        borderRadius: "8px",
        color: '#FFF',
        "@media (max-width: 560px)": {
            display: 'none'
        }
    },
    SignInButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px 23px",
        gap: "10px",
        width: "115px",
        height: "47px",
        background: "#2C2C3A",
        border: "1px solid #363646",
        borderRadius: "8px",
        color: '#FFF',
        "@media (max-width: 764px)": {
            width: '50px',
            minWidth: '50px',
            padding: '0px'
        }
    },
    RegisterButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px 23px",
        gap: "10px",
        width: "115px",
        height: "47px",
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        borderRadius: "8px",
        color: '#FFF',
        "@media (max-width: 764px)": {
            display: 'none'
        }
    },
    ChatButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        width: "50px",
        height: "47px",
        background: "#2C2C3A",
        border: "1px solid #363646",
        borderRadius: "8px",
        padding: '0px',
        "@media (max-width: 764px)": {
            display: 'none'
        }
    },
    ProfileButton: {
        borderRadius: '50%',
        background: '#282836',
        padding: '0px',
        width: "50px",
        height: "47px"
    },
    HeaderMiddleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        "@media (max-width: 850px)": {
            // display: 'none'
        }
    },
    WalletButton: {
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        borderRadius: "8px",
        color: "#FFF",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px 23px",
        gap: "10px",
        width: "115px",
        height: "47px",
        "&:disabled": {
            color: 'rgba(255, 255, 255, 150)',
            opacity: '0.5'
        },
        "@media (max-width: 681px)": {
            display: 'none'
        }
    },
    MobileWalletButton: {
        display: 'none',
        width: '50px',
        height: '47px',
        "@media (max-width: 681px)": {
            display: 'block'
        }
    },
    CoinAmountBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '40px',
        width: '100%',
        marginRight: '5px',
        "@media (max-width: 1075px)": {
            width: 'unset'
        }
    },
    CoinIcon: {
        width: '18px',
        height: '18px',
        marginRight: '2px'
    },
    CoinAmountSpan: {
        color: 'rgb(249, 253, 255)',
        fontWeight: '700',
        fontSize: '18px',
        width: '100%'
    },
    CoinTypeBox: {
        background: '#2C2C3A',
        padding: '0px 5px',
        borderRadius: 4,
        fontWeight: 'bold',
        color: '#EC4F5B',
        textTransform: 'uppercase',
        fontSize: 13,
        whiteSpace: 'pre',
        border: 'solid 1px #363646',
        "@media (max-width: 380px)": {
            display: 'none'
        }
    },
    CustomSelect: {
        boxSizing: "border-box",
        width: "341px",
        height: "47px",
        left: "0px",
        top: "0px",
        border: "1px solid #363646",
        borderRadius: "8px",
        background: "transparent",
        color: '#FFF',
        "&>svg.MuiSvgIcon-root": {
            color: '#FFF'
        },
        "&>.MuiSelect-select": {
            background: 'transparent',
            color: '#FFF',
            fontSize: '14px',
            fontWeight: '700',
            padding: '0px 10px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '5px'
        },
        "&>.Mui-disabled": {
            "-webkit-text-fill-color": 'unset',
            opacity: '0.6'
        },
        "@media (max-width: 1224px)": {
            width: '195px',
            height: '47px'
        },
        "@media (max-width: 380px)": {
            width: '155px'
        }
    },
    CurrencyIcon: {
        width: '16px',
        height: '16px'
    },
    CustomMenuItem: {
        color: '#FFF',
        display: 'flex',
        gap: '5px',
        fontSize: '14px',
        fontWeight: '700',
        padding: '10px 16px'
    },
    LevelIconBox: {
        position: 'absolute',
        right: '0px',
        bottom: '0px',
        width: '18.7px',
        height: '18.7px',
        borderRadius: '50%',
        background: '#1F1E25',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ProfileBox: {
        position: 'absolute',
        right: '0px',
        top: '90px'
    },
    ChatBox: {
        position: 'absolute',
        right: '0px',
        top: '90px'
    },
    UserSettingBox: {
        position: 'absolute',
        right: '0px',
        top: '90px',
        zIndex: '3'
    }
}));

let signoutModal = false;

const MainHeader = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const modalOption = useSelector((state) => state.modalOption);
    const authData = useSelector((state) => state.authentication);
    const currencyData = useSelector((state) => state.currencyOption);
    const currencies = currencyData.currencies;

    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [signoutModalOpen, setSignoutModalOpen] = useState(false);
    const [menuModal, setMenuModal] = useState(false);
    const walletModalOpen = modalOption.walletModal;
    const levelModalOpen = modalOption.levelModal;
    const spinModalOpen = modalOption.spinModal;
    const settingModalOpen = modalOption.settingModal;
    const fairModalOpen = modalOption.fairModal;
    const privacyModalOpen = modalOption.privacyModal;

    const [authType, setAuthType] = useState(0);
    const currency = authData.isAuth ? authData.userData.currency : '';

    const [profileMenu, setProfileMenu] = useState(false);
    const [chatPage, setChatPage] = useState(false);
    const [userSetting, setUserSetting] = useState(false);

    const profileButtonRef = useRef();
    const profileWidgetRef = useRef();

    const userSettingRef = useRef();

    const chatButtonRef = useRef();
    const chatWidgetRef = useRef();

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        getCurrencyData();

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (authType !== 0)
            setAuthModalOpen(true);
        // eslint-disable-next-line
    }, [authType]);

    useEffect(() => {
        if (!authModalOpen)
            setAuthType(0);
        // eslint-disable-next-line
    }, [authModalOpen]);

    useEffect(() => {
        setTimeout(() => {
            signoutModal = signoutModalOpen;
        }, 100)
        // eslint-disable-next-line
    }, [signoutModalOpen]);

    const getCurrencyData = async () => {
        const response = await getCurrencies();
        if (response.status) {
            let data = [];
            // eslint-disable-next-line
            response.data.map((item) => {
                data.push({
                    name: item.currencyName,
                    fullName: item.fullName,
                    decimal: item.decimal,
                    token: item.token,
                    withdrawable: item.withdrawable,
                    swapable: item.swapable
                });
            });
            dispatch({ type: 'SET_CURRENCIES', data: data });
        }
    }

    const handleClickOutside = (e) => {
        if (signoutModal) return;
        if (profileWidgetRef.current && !profileWidgetRef.current.contains(e.target)) {
            if (profileButtonRef.current && !profileButtonRef.current.contains(e.target)) {
                setProfileMenu(false);
            }
        }
        if (chatWidgetRef.current && !chatWidgetRef.current.contains(e.target)) {
            if (chatButtonRef.current && !chatButtonRef.current.contains(e.target)) {
                setChatPage(false);
            }
        }
    };

    const setWalletModalOpen = (flag) => {
        dispatch({ type: 'SET_WALLET_MODAL', data: flag });
    };

    const setLevelModalOpen = (flag) => {
        dispatch({ type: 'SET_LEVEL_MODAL', data: flag });
    };

    const setSpinModalOpen = (flag) => {
        dispatch({ type: 'SET_SPIN_MODAL', data: flag });
    };

    const setSettingModalOpen = (flag) => {
        dispatch({ type: 'SET_SETTING_MODAL', data: flag });
    };

    const setFairModalOpen = (flag) => {
        dispatch({ type: 'SET_FAIR_MODAL', data: flag });
    };

    const setPrivacyModalOpen = (flag) => {
        dispatch({ type: 'SET_PRIVACY_MODAL', data: flag });
    };

    const handleLogin = () => {
        setAuthType(1);
    };

    const handleRegister = () => {
        setAuthType(2);
    };

    const handleWalletOpen = () => {
        setWalletModalOpen(true)
    };

    const handleMenuCollape = () => {
        // dispatch({ type: 'SET_MENUVISIBLE', data: !menuOption.menuVisible });
    };

    const handleChatVisible = () => {
        setChatPage(!chatPage);
    };

    const handleCurrency = (e) => {
        updatePlayerCurrency(e.target.value);
    };

    const handleProfileMenu = () => {
        setProfileMenu(!profileMenu);
    };

    const handleUserSetting = (flag) => {
        setUserSetting(flag);
        if (flag) setProfileMenu(false);
    };

    const handleMobileMenu = (flag) => {
        setMenuModal(true);
    };

    const updatePlayerCurrency = async (newCurrency) => {
        if (authData.isAuth) {
            const request = {
                userId: authData.userData._id,
                currency: JSON.parse(newCurrency),
            };
            const response = await updateCurrency(request);
            if (response.status) {
                dispatch({ type: 'SET_USERDATA', data: response.data });
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
        else {
            addToast('Please login and try again', { appearance: 'warning', autoDismiss: true });
        }
    };

    return (
        <header className={classes.MainHeaderBox}>
            <Box className={classes.LogoBox}>
                {/* <IconButton className={classes.MenuIconButton} onClick={handleMenuCollape}>
                    <MenuCollapeIcon />
                </IconButton> */}
                {/* <IconButton className={classes.MobileMenuIconButton} onClick={handleMobileMenu}>
                    <MobileMenuCollapeIcon />
                </IconButton> */}
                {/* <LogoIcon className={classes.LogoIcon} /> */}
                <img src={`/assets/images/Logo.png`} className={classes.LogoIcon} alt="Logo" />
            </Box>
            <Box className={classes.HeaderMiddleBox}>
                <Box className={classes.CoinAmountBox}>
                    <FormControl fullWidth>
                        <Select
                            labelId="currencyType"
                            id="currencyType"
                            value={JSON.stringify(currency)}
                            onChange={handleCurrency}
                            className={classes.CustomSelect}
                            disabled={!authData.isAuth}
                        >
                            {
                                currencies.map((currency, index) => {
                                    let currencyBalance = (authData.balanceData && authData.balanceData.length > 0) ? authData.balanceData.find((data) => data.coinType === currency.name && data.type === currency.token) : { balance: 0 };
                                    return (
                                        <MenuItem key={index} value={JSON.stringify({ coinType: currency.name, type: currencyBalance.type })} className={classes.CustomMenuItem}>
                                            <img className={classes.CurrencyIcon} src={`/assets/images/coins/${currency.name.toLowerCase()}.png`} alt='icon' />
                                            <span className={classes.CoinAmountSpan}>
                                                {
                                                    currencyBalance.balance.toFixed(currency.decimal)
                                                }
                                            </span>
                                            <Box className={classes.CoinTypeBox}>{(currency.token === 'native' || currency.token === '') ? currency.name : `${currency.name}(${currency.token})`}</Box>
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Button className={clsx(classes.HeaderButton, classes.WalletButton)} disabled={!authData.isAuth} onClick={handleWalletOpen}>
                    <span>Wallet</span>
                </Button>
                <IconButton className={classes.MobileWalletButton} disabled={!authData.isAuth} onClick={handleWalletOpen}>
                    <MobileWalletIcon />
                </IconButton>
            </Box>
            <Box className={classes.LoginBox}>
                {
                    !authData.isAuth &&
                    <Button className={clsx(classes.HeaderButton, classes.SignInButton)} onClick={handleLogin}>
                        <span>Sign In</span>
                    </Button>
                }
                {
                    !authData.isAuth &&
                    <Button className={clsx(classes.HeaderButton, classes.RegisterButton)} onClick={handleRegister}>
                        <span>Register</span>
                    </Button>
                }
                {
                    !authData.isAuth &&
                    <IconButton className={clsx(classes.HeaderButton, classes.ChatButton)} onClick={handleChatVisible}>
                        <img src={MessageIcon} alt="icon" width="38px" height="27px" />
                    </IconButton>
                }
                <Button className={clsx(classes.HeaderButton, classes.CustomizeButton)}>
                    <span>Uniswap</span>
                </Button>
                <Button className={clsx(classes.HeaderButton, classes.CustomizeButton)}>
                    <span>Dextools</span>
                </Button>
                {
                    authData.isAuth &&
                    <>
                        <IconButton className={clsx(classes.HeaderButton, classes.ChatButton)}>
                            <AlarmIcon />
                        </IconButton>
                        <IconButton ref={chatButtonRef} className={clsx(classes.HeaderButton, classes.ChatButton)} onClick={handleChatVisible}>
                            <ChatIcon />
                        </IconButton>
                        <IconButton className={clsx(classes.HeaderButton, classes.ChatButton)}>
                            <SystemMessageIcon />
                        </IconButton>
                        <IconButton ref={profileButtonRef} className={clsx(classes.HeaderButton, classes.ProfileButton)} onClick={handleProfileMenu}>
                            <ProfileIcon />
                            <Box className={classes.LevelIconBox}>
                                <StarIcon />
                            </Box>
                        </IconButton>

                    </>
                }
                {
                    profileMenu &&
                    <Box className={classes.ProfileBox} ref={profileWidgetRef}>
                        <ProfileWidget
                            closeProfileMenu={() => setProfileMenu(false)}
                            setSignoutModal={setSignoutModalOpen}
                            handleUserSetting={handleUserSetting}
                            userSettingRef={userSettingRef}
                        />
                    </Box>
                }
                {
                    chatPage &&
                    <Box className={classes.ChatBox} ref={chatWidgetRef}>
                        <ChatWidget />
                    </Box>
                }
                {
                    userSetting &&
                    <Box className={classes.UserSettingBox} ref={userSettingRef}>
                        <UserSetting setUserSetting={setUserSetting} />
                    </Box>
                }
            </Box>
            <AuthenticationModal open={authModalOpen} setOpen={setAuthModalOpen} authType={authType} />
            <WalletModal open={walletModalOpen} setOpen={setWalletModalOpen} />
            <SignoutModal open={signoutModalOpen} setOpen={setSignoutModalOpen} />
            <MenuModal open={menuModal} setOpen={setMenuModal} />
            <LevelModal open={levelModalOpen} setOpen={setLevelModalOpen} />
            <FreeSpinModal open={spinModalOpen} setOpen={setSpinModalOpen} />
            <SettingModal open={settingModalOpen} setOpen={setSettingModalOpen} />
            <FairModal open={fairModalOpen} setOpen={setFairModalOpen} />
            <PrivacyModal open={privacyModalOpen} setOpen={setPrivacyModalOpen} />
        </header>
    )
}

export default MainHeader;