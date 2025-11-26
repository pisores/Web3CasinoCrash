import { Close } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactComponent as MenuTopIcon } from "assets/icons/MenuTop.svg";
import { ReactComponent as GoogleIcon } from "assets/icons/google-icon.svg";
// import { ReactComponent as AppleIcon } from "assets/icons/apple-icon.svg";
// import { ReactComponent as TelegramIcon } from "assets/icons/telegram-icon.svg";
// import { ReactComponent as LineIcon } from "assets/icons/line-icon.svg";
// import { ReactComponent as EmailIcon } from "assets/icons/email-icon.svg";
// import { ReactComponent as BrowserIcon } from "assets/icons/browser-icon.svg";
import { ReactComponent as HelpIcon } from "assets/icons/help-icon.svg";
import SettingSwitch from "views/components/switch/SettingSwitch";
import { useState } from "react";
import clsx from "clsx";
import SettingCheckBox from "views/components/checkbox/SettingCheckBox";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { updatePrivacyData, updateUserGameSetting } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    PageLayout: {
        width: "495px",
        height: "calc(100vh - 90px)",
        background: "linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)",
        borderRadius: "10px 0px 0px 10px",
        padding: '4px 0px 0px 4px',
        zIndex: '3',
        overflow: 'auto',
        position: 'relative',
        "@media (max-width: 681px)": {
            width: '100vw',
            padding: '4px 0px 0px 0px',
            borderRadius: '0px'
        }
    },
    PageBox: {
        width: '100%',
        height: '100%',
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
        overflow: 'auto',
        "@media (max-width: 681px)": {
            width: '100%',
            borderRadius: '0px'
        }
    },
    TopIconBox: {
        position: 'absolute',
        top: '-16px',
        right: '66px'
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
            zIndex: 10,
            right: 'unset',
            left: '50%',
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
            },
            position: 'fixed',
            top: '60px'
        }
    },
    TitleBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px'
    },
    BeforeButton: {
        width: '40px',
        height: '36px',
        color: '#FFF',
        borderRadius: '8px',
        backgroundColor: '#1F1E25'
    },
    TitleText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "26px",
        lineHeight: "36px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        opacity: 0.5
    },
    NetworkBox: {
        width: '100%',
        marginTop: '24px'
    },
    NetworkTitle: {
        color: '#FFF',
        fontSize: '20px',
        fontWeight: '700',
        fontFamily: 'Styrene A Web',
        textTransform: 'uppercase',
        lineHeight: '1.5'
    },
    NetworkItemBox: {
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    NetworkItem: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    NetworkHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        "&>svg": {
            width: '40px',
            height: '40px'
        }
    },
    GamePlayHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        "&>svg": {
            width: '15px',
            height: '15px'
        }
    },
    NetworkName: {
        color: '#FFF'
    },
    WalletBox: {
        width: '100%',
        marginTop: '24px'
    },
    WalletText: {
        fontFamily: "'Cera Pro'",
        fontStyle: "normal",
        fontSize: "16px",
        lineHeight: "20px",
        color: "#FFFFFF",
        marginTop: '12px'
    },
    ConnectWalletButton: {
        marginTop: '12px',
        width: '100%',
        height: '45px',
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%)',
        borderRadius: '8px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textTransform: "uppercase",
        color: '#FFF'
    },
    CheckBoxLayout: {
        paddingLeft: "100px",
        display: "flex",
        flexWrap: "wrap"
    }
}));

const UserSetting = ({ setUserSetting }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const [googleConnected, setGoogleConnected] = useState(false);
    // const [appleConnected, setAppleConnected] = useState(false);
    // const [telegramConnected, setTelegramConnected] = useState(false);
    // const [lineConnected, setLineConnected] = useState(false);

    // const [emailNotification, setEmailNotification] = useState(false);
    // const [browserNotification, setBrowserNotification] = useState(false);
    // const [telegramNotification, setTelegramNotification] = useState(false);
    // const [lineNotification, setLineNotification] = useState(false);

    // const [auth2FA, setAuth2FA] = useState(false);
    // const [key2FA, setKey2FA] = useState(false);
    // const [tg2FA, setTg2FA] = useState(false);
    // const [line2FA, setLine2FA] = useState(false);

    // const [ethAddress, setEthAddress] = useState('');

    // const [checkBoxSetting, setCheckBoxSetting] = useState({
    //     bonus: false,
    //     payment: false,
    //     security: false,
    //     annoucements: false,
    //     newsletter: false
    // });

    const settingData = useSelector((state) => state.settingOption);
    const authData = useSelector((state) => state.authentication);
    const privacyData = useSelector((state) => state.privacyOption);

    const handleCloseMenu = () => {
        setUserSetting(false);
    };

    // const handleCheckBoxSetting = (value, key) => {
    //     let settingData = checkBoxSetting;
    //     settingData[key] = value;
    //     setCheckBoxSetting({ ...settingData });
    // }

    const handleConnectMetamask = () => {
        // if (window.ethereum) {
        //     window.ethereum.request({ method: 'eth_requestAccounts' })
        //         .then(res => {
        //             // setEthAddress(res[0]);
        //         })
        //         .catch(err => {
        //             console.error(err.message);
        //             addToast(err.message, { appearance: 'error', autoDismiss: true });
        //         });
        // }
    }

    const updateSetting = async (key, value) => {
        if (authData.isAuth) {
            let setting = settingData;
            setting[key] = value;
            const request = {
                userId: authData.userData._id,
                settingData: setting
            };
            const response = await updateUserGameSetting(request);
            if (response.status) {
                dispatch({ type: 'INIT_SETTING', data: response.data });
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    };

    const handlePrivacyData = async (key, value) => {
        if (authData.isAuth) {
            let privacy = privacyData;
            privacy[key] = value;
            const request = {
                userId: authData.userData._id,
                privateProfile: privacy.privateProfile,
                showOnlineIndicator: privacy.showOnlineIndicator
            };
            const response = await updatePrivacyData(request);
            if (response.status) {
                const data = {
                    privateProfile: response.data.privateProfile,
                    showOnlineIndicator: response.data.showOnlineIndicator
                };
                dispatch({ type: 'INIT_PRIVACY', data });
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
    };

    return (
        <Box className={clsx(classes.PageLayout)}>
            <Box className={clsx(classes.PageBox, 'NoScroll')}>
                <Box className={classes.TopIconBox}>
                    <MenuTopIcon />
                </Box>
                <Box className={classes.CloseIconBox}>
                    <IconButton onClick={handleCloseMenu}>
                        <Close />
                    </IconButton>
                </Box>
                <Box className={classes.TitleBox}>
                    {/* <IconButton className={classes.BeforeButton}>
                        <ArrowLeft />
                    </IconButton> */}
                    <span className={classes.TitleText}>Setting</span>
                </Box>
                <Box className={classes.NetworkBox}>
                    <Box className={classes.NetworkTitle}>Networks</Box>
                    <Box className={classes.NetworkItemBox}>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <GoogleIcon />
                                <Box className={classes.NetworkName}>
                                    Google
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={googleConnected} setCheck={setGoogleConnected} disabled={true} />
                            </Box>
                        </Box>
                        {/* <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <AppleIcon />
                                <Box className={classes.NetworkName}>
                                    Apple
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={appleConnected} setCheck={setAppleConnected} disabled={true} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <TelegramIcon />
                                <Box className={classes.NetworkName}>
                                    Telegram
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={telegramConnected} setCheck={setTelegramConnected} disabled={true} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <LineIcon />
                                <Box className={classes.NetworkName}>
                                    Line
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={lineConnected} setCheck={setLineConnected} disabled={true} />
                            </Box>
                        </Box> */}
                    </Box>
                </Box>
                <Box className={classes.WalletBox}>
                    <Box className={classes.NetworkTitle}>Wallets</Box>
                    <Box className={classes.WalletText}>Connect your first wallet</Box>
                    <Button className={classes.ConnectWalletButton} onClick={handleConnectMetamask}>Connect Wallet</Button>
                </Box>
                {/* <Box className={classes.WalletBox}>
                    <Box className={classes.NetworkTitle}>Notifications</Box>
                    <Box className={classes.NetworkItemBox}>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <EmailIcon />
                                <Box className={classes.NetworkName}>
                                    Email
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={emailNotification} setCheck={setEmailNotification} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.CheckBoxLayout}>
                            <SettingCheckBox label="Bonuses" checkKey='bonus' check={checkBoxSetting.bonus} setCheck={handleCheckBoxSetting} />
                            <SettingCheckBox label="Payments" checkKey='payment' check={checkBoxSetting.payment} setCheck={handleCheckBoxSetting} />
                            <SettingCheckBox label="Security" checkKey='security' check={checkBoxSetting.security} setCheck={handleCheckBoxSetting} />
                            <SettingCheckBox label="Announcements" checkKey='annoucements' check={checkBoxSetting.annoucements} setCheck={handleCheckBoxSetting} />
                            <SettingCheckBox label="Newsletter" checkKey='newsletter' check={checkBoxSetting.newsletter} setCheck={handleCheckBoxSetting} />
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <BrowserIcon />
                                <Box className={classes.NetworkName}>
                                    Browser
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={browserNotification} setCheck={setBrowserNotification} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <TelegramIcon />
                                <Box className={classes.NetworkName}>
                                    Telegram
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={telegramNotification} setCheck={setTelegramNotification} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <LineIcon />
                                <Box className={classes.NetworkName}>
                                    Line
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={lineNotification} setCheck={setLineNotification} disabled={false} />
                            </Box>
                        </Box>
                    </Box>
                </Box> */}
                {/* <Box className={classes.WalletBox}>
                    <Box className={classes.NetworkTitle}>Two Factor<br />Authentication</Box>
                    <Box className={classes.NetworkItemBox}>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <EmailIcon />
                                <Box className={classes.NetworkName}>
                                    Authenticator
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={auth2FA} setCheck={setAuth2FA} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <EmailIcon />
                                <Box className={classes.NetworkName}>
                                    Security Keys
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={key2FA} setCheck={setKey2FA} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <TelegramIcon />
                                <Box className={classes.NetworkName}>
                                    Telegram
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={tg2FA} setCheck={setTg2FA} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.NetworkHead}>
                                <LineIcon />
                                <Box className={classes.NetworkName}>
                                    Line
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={line2FA} setCheck={setLine2FA} disabled={false} />
                            </Box>
                        </Box>
                    </Box>
                </Box> */}
                <Box className={classes.WalletBox}>
                    <Box className={classes.NetworkTitle}>Gameplay</Box>
                    <Box className={classes.NetworkItemBox}>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.GamePlayHead}>
                                <Box className={classes.NetworkName}>
                                    Animation
                                </Box>
                                <HelpIcon />
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={settingData.animation} setCheck={() => updateSetting('animation', !settingData.animation)} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.GamePlayHead}>
                                <Box className={classes.NetworkName}>
                                    Audio
                                </Box>
                                <HelpIcon />
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={settingData.sound} setCheck={() => updateSetting('sound', !settingData.sound)} disabled={false} />
                            </Box>
                        </Box>
                        {
                            settingData.sound &&
                            <Box className={classes.CheckBoxLayout}>
                                <SettingCheckBox
                                    label="Background music"
                                    checkKey='bgMusic'
                                    check={settingData.backgroundSound}
                                    setCheck={() => updateSetting('backgroundSound', !settingData.backgroundSound)}
                                />
                                <SettingCheckBox
                                    label="Sound effects"
                                    checkKey='soundEffect'
                                    check={settingData.effectSound}
                                    setCheck={() => updateSetting('effectSound', !settingData.effectSound)}
                                />
                            </Box>
                        }
                    </Box>
                </Box>
                <Box className={classes.WalletBox}>
                    <Box className={classes.NetworkTitle}>Privacy</Box>
                    <Box className={classes.NetworkItemBox}>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.GamePlayHead}>
                                <Box className={classes.NetworkName}>
                                    Private profile
                                </Box>
                                <HelpIcon />
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={privacyData.privateProfile} setCheck={(value) => handlePrivacyData('privateProfile', value)} disabled={false} />
                            </Box>
                        </Box>
                        <Box className={classes.NetworkItem}>
                            <Box className={classes.GamePlayHead}>
                                <Box className={classes.NetworkName}>
                                    Show online indicator
                                </Box>
                            </Box>
                            <Box className={classes.NetworkConfirm}>
                                <SettingSwitch check={privacyData.showOnlineIndicator} setCheck={(value) => handlePrivacyData('showOnlineIndicator', value)} disabled={false} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UserSetting;