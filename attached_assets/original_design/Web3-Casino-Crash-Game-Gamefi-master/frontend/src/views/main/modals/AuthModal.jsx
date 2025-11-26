import { Modal, Box, IconButton, Button, Typography } from "@mui/material";
import { Close, Apple } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import clsx from "clsx";
import CustomButton from "views/components/buttons/CustomButton";
import MetamaskIcon from "assets/icons/metamask.png";
import CoinBaseIcon from "assets/icons/coinbase.png";
import WalletConnectIcon from "assets/icons/walletconnect.png";
import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGoogleLogin } from '@react-oauth/google';
import { userGoogleLogin, metamaskLogin, getMyBalances, emailLogin, verifyEmailCode, updateProfileSet } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";
import Config from "config/index";
import { ReactComponent as LogoIcon } from "assets/icons/Logo.svg";
import { ReactComponent as GoogleIcon } from "assets/icons/GoogleIcon.svg";
import ReactCodeInput from "react-verification-code-input";
import { LoadingContext } from "layout/Context/loading";
import parser from "query-string";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

const useStyles = makeStyles(() => ({
    ModalBox: {
        marginTop: '160px',
        width: '533px',
        height: '714px',
        left: '50%',
        transform: 'translate(-50%)',
        background: '#2C2C3A',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px',
        "@media (max-width: 681px)": {
            width: '100%',
            padding: '28px',
            borderRadius: '0px'
        }
    },
    ModalCloseButton: {
        position: 'absolute',
        top: '-32px',
        right: '-32px',
        width: '64px',
        height: '64px',
        color: '#55556F',
        background: '#2C2C3A',
        border: '6px solid #24252D',
        "&:hover": {
            background: '#2C2C3AEE'
        },
        "@media (max-width: 681px)": {
            transform: 'translate(-50%)',
            right: 'unset',
            left: '50%'
        }
    },
    ModalBodyBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '422px',
        flexDirection: 'column',
        "@media (max-width: 370px)": {
            width: '90%'
        }
    },
    ModalLogoBox: {
        marginBottom: '34px',
        "&>svg": {
            width: '245px',
            height: '32px'
        }
    },
    ModalInputBox: {
        width: '100%',
        marginBottom: '14px'
    },
    EmailInput: {
        width: '100%',
        background: '#424253',
        outline: 'none',
        border: 'none',
        textAlign: 'center',
        color: '#FFF',
        fontSize: '17px',
        height: '54px',
        fontWeight: '400',
        borderRadius: '7px',
        fontFamily: 'Styrene A Web',
        lineHeight: '22px',
        "&::placeholder": {
            color: '#FFF'
        }
    },
    AuthButton: {
        width: '100%',
        height: '55px',
        fontSize: '16px',
        fontWeight: '700',
        fontFamily: 'Styrene A Web',
        lineHeight: '20px'
    },
    NextButton: {
        background: 'linear-gradient(48.57deg, #5A45D1 24.42%, #BA6AFF 88.19%);',
        color: '#FFF',
        textTransform: 'uppercase',
        borderRadius: '8px',
    },
    ORBox: {
        background: '#424253',
        color: '#FFF',
        marginTop: '20px',
        marginBottom: '20px',
        borderRadius: '7px',
        padding: '6px 13px',
        textAlign: "center",
        "&>span": {
            textTransform: 'uppercase',
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: '400',
            fontSize: "17px",
            lineHeight: "22px"
        }
    },
    AppleLoginButton: {
        background: '#000',
        color: '#FFF'
    },
    WalletConnectIcon: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#FFF',
        "&>img": {
            borderRadius: '50%',
            width: '100%',
            height: '100%'
        }
    },
    WalletConnectBox: {
        display: 'flex',
        gap: '10px'
    },
    GoogleLoginButton: {
        width: '100%',
        height: '50px',
        borderRadius: '5px !important',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(rgb(249, 253, 255) 0%, rgb(207, 226, 234) 100%)',
        marginBottom: '10px',
        "&>div": {
            background: 'unset !important',
            margin: '0px',
            position: 'absolute',
            left: '10px'
        },
        "&>span": {
            padding: '0px !important',
            color: '#1a2c38',
            fontWeight: '700 !important',
            fontSize: '16px',
        },
        "&:disabled": {
            cursor: 'not-allowed'
        }
    },
    backdrop: {
        backgroundColor: '#1F1E25',
        opacity: '0.95 !important'
    },
    CodeTitle: {
        fontSize: '20px',
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        lineHeight: '22px',
        textTransform: 'uppercase',
        fontWeight: '700'
    },
    CodeSubTitle: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    CodeInput: {
        "&>div": {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        "&>div>input": {
            borderRadius: '6px',
            color: '#FFF',
            background: '#424253',
            border: 'none',
            width: '50px !important',
            height: '50px !important',
            fontFamily: 'Styrene A Web',
            "&:focus": {
                border: 'none',
                caretColor: '#FFF'
            }
        },
        "&>div>input:first-child": {
            'border-top-left-radius': '6px',
            'border-bottom-left-radius': '6px'
        },
        "&>div>input:last-child": {
            'border-top-right-radius': '6px',
            'border-bottom-right-radius': '6px',
            borderRight: '0px'
        }
    },
    ResendButton: {
        fontSize: '16px',
        color: '#FFF',
        fontFamily: 'Styrene A Web',
        cursor: 'pointer'
    },
    PromotionCode: {
        paddingLeft: 16,
        "&::placeholder": {
            color: '#aaa',
            fontSize: 14
        }
    }
}));

const PROFILE_STATUS = {
    INIT: 0,
    UNSET: 1,
    SET: 2
};

const INFRA_API_KEY = '69b01f7c51d044c0a7883220a2104df3';

const CoinbaseWallet = new WalletLinkConnector({
    url: `https://mainnet.infura.io/v3/${INFRA_API_KEY}`,
    appName: "Web3-react-demo"
});

const WalletConnect = new WalletConnectConnector({
    rpcUrl: `https://mainnet.infura.io/v3/${INFRA_API_KEY}`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
});

const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});

const AuthenticationModal = ({ open, setOpen, authType }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const authData = useSelector((state) => state.authentication);
    const [isMetamask, setMetamask] = useState(false);
    // const [ethAddress, setEthAddress] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [codeInput, setCodeInput] = useState(false);
    // eslint-disable-next-line
    const [verifyCode, setVerifyCode] = useState('');
    const [profileSet, setProfileSet] = useState(PROFILE_STATUS.INIT);
    const [userNickName, setUserNickName] = useState('');
    const [promotionCode, setPromotionCode] = useState('');

    const [campaignData, setCampaignData] = useState({ exist: false, code: '' });

    const handleClose = () => setOpen(false);

    const { activate, account, active } = useWeb3React();

    useEffect(() => {
        if (typeof window.web3 !== 'undefined') {
            if (window.web3.currentProvider.isMetaMask === true) {
                setMetamask(true);
            }
            else {
                setMetamask(false);
            }
        }
        else {
            setMetamask(false);
        }

        const codeData = parser.parse(window.location.search);
        if (codeData.code) {
            setCampaignData({ exist: true, code: codeData.code });
            setPromotionCode(codeData.code);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (profileSet === PROFILE_STATUS.SET) {
            setOpen(false);
        }
        // eslint-disable-next-line
    }, [profileSet]);

    useEffect(() => {
        if (active) {
            const userMetamaskLogin = async () => {
                const response = await metamaskLogin({ address: account, type: 'eth', campaignData });
                if (response.data.status) {
                    dispatch({ type: 'SET_AUTH' });
                    Config.Api.setToken(response.data.userData.userToken);
                    dispatch({ type: 'SET_USERDATA', data: response.data.userData });
                    setProfileSet(response.data.userData.profileSet ? PROFILE_STATUS.SET : PROFILE_STATUS.UNSET);
                    setUserNickName(response.data.userData.userNickName);

                    const settingData = {
                        inited: true,
                        sound: response.data.setting.sound,
                        backgroundSound: response.data.setting.backgroundSound,
                        effectSound: response.data.setting.effectSound,
                        hotkey: response.data.setting.hotkey,
                        animation: response.data.setting.animation,
                        maxBet: response.data.setting.maxBet
                    };
                    dispatch({ type: 'INIT_SETTING', data: settingData });

                    const balanceData = await getMyBalances({ userId: response.data.userData._id });
                    if (balanceData.status) {
                        dispatch({ type: 'SET_BALANCEDATA', data: balanceData.data.data });
                    }
                    else {
                        addToast(response.message, { appearance: 'error', autoDismiss: true });
                    }
                }
                else {
                    addToast(response.message, { appearance: 'error', autoDismiss: true });
                }
            };
            userMetamaskLogin();
        }
        // eslint-disable-next-line
    }, [active]);

    // const handleConnectMetamask = () => {
    //     if (window.ethereum) {
    //         window.ethereum.request({ method: 'eth_requestAccounts' })
    //             .then(res => {
    //                 setEthAddress(res[0]);
    //             })
    //             .catch(err => {
    //                 console.error(err.message);
    //                 addToast(err.message, { appearance: 'error', autoDismiss: true });
    //             });
    //     }
    // }

    const googleLogin = useGoogleLogin({
        onSuccess: response => googleLoginSuccess(response),
        onError: error => googleLoginFail(error)
    })

    const googleLoginSuccess = async (success) => {
        const { access_token } = success;
        const request = { accessToken: access_token, campaignData };
        const response = await userGoogleLogin(request);
        if (response.status) {
            dispatch({ type: 'SET_AUTH' });
            Config.Api.setToken(response.data.userData.userToken);
            dispatch({ type: 'SET_USERDATA', data: response.data.userData });
            setProfileSet(response.data.userData.profileSet ? PROFILE_STATUS.SET : PROFILE_STATUS.UNSET);
            setUserNickName(response.data.userData.userNickName);

            const settingData = {
                inited: true,
                sound: response.data.setting.sound,
                backgroundSound: response.data.setting.backgroundSound,
                effectSound: response.data.setting.effectSound,
                hotkey: response.data.setting.hotkey,
                animation: response.data.setting.animation,
                maxBet: response.data.setting.maxBet
            };
            dispatch({ type: 'INIT_SETTING', data: settingData });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
    }

    const googleLoginFail = (error) => {
        addToast(error, { appearance: 'error', autoDismiss: true });
    }

    const handleEmailLogin = async () => {
        if (vaildateEmailAddress(emailAddress)) {
            showLoading();
            const request = { emailAddress };
            const response = await emailLogin(request);
            if (response.status) {
                setCodeInput(true);
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
            hideLoading();
        }
    }

    const vaildateEmailAddress = (address) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(address);
    }

    const completeVerifyCode = async (value) => {
        sendVerifyCode(value);
    }

    const sendVerifyCode = async (value) => {
        showLoading();
        const request = { emailAddress, code: value, campaignData };
        const response = await verifyEmailCode(request);
        if (response.status) {
            dispatch({ type: 'SET_AUTH' });
            Config.Api.setToken(response.userData.userToken);
            dispatch({ type: 'SET_USERDATA', data: response.userData });
            setProfileSet(response.userData.profileSet ? PROFILE_STATUS.SET : PROFILE_STATUS.UNSET);
            setUserNickName(response.userData.userNickName);

            const settingData = {
                inited: true,
                sound: response.setting.sound,
                backgroundSound: response.setting.backgroundSound,
                effectSound: response.setting.effectSound,
                hotkey: response.setting.hotkey,
                animation: response.setting.animation,
                maxBet: response.setting.maxBet
            };
            dispatch({ type: 'INIT_SETTING', data: settingData });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    }

    const handleChangeCode = (value) => {
        setVerifyCode(value);
    }

    const handleResendCode = async () => {
        showLoading();
        const request = { emailAddress };
        const response = await emailLogin(request);
        if (response.status) {
            addToast('Sent!', { appearance: 'success', autoDismiss: true });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
        hideLoading();
    }

    const handleProfileSet = async () => {
        const request = {
            profileSet: true,
            userNickName,
            promotionCode,
            userId: authData.userData._id
        };
        const response = await updateProfileSet(request);
        if (response.status) {
            setProfileSet(PROFILE_STATUS.SET);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            slotProps={{ backdrop: { className: classes.backdrop } }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.ModalBox}>
                <IconButton className={classes.ModalCloseButton} onClick={handleClose}>
                    <Close />
                </IconButton>
                <Box className={classes.ModalBodyBox}>
                    <Box className={classes.ModalLogoBox}>
                        <img src={`/assets/images/Logo.png`} alt="Logo" />
                    </Box>
                    {
                        (!codeInput && profileSet === PROFILE_STATUS.INIT) &&
                        <>
                            <Box className={classes.ModalInputBox}>
                                <input value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className={classes.EmailInput} type="email" spellCheck="false" placeholder="Enter your email"></input>
                            </Box>
                            <Button className={clsx(classes.NextButton, classes.AuthButton)} onClick={handleEmailLogin}>
                                <span>Next</span>
                            </Button>
                            <Box className={classes.ORBox}>
                                <span>OR</span>
                            </Box>
                            <CustomButton Icon={Apple} Text="Continue with Apple" customStyle={classes.AppleLoginButton} />
                            <CustomButton Icon={GoogleIcon} Text="Continue with Google" onClick={googleLogin} />
                            <Box className={classes.ORBox}>
                                <span>Continue With Wallet</span>
                            </Box>
                            <Box className={classes.WalletConnectBox}>
                                {
                                    isMetamask &&
                                    // <IconButton className={classes.WalletConnectIcon} onClick={handleConnectMetamask}>
                                    <IconButton className={classes.WalletConnectIcon} onClick={() => { activate(Injected) }}>
                                        <img src={MetamaskIcon} alt="icon" />
                                    </IconButton>
                                }
                                <IconButton className={classes.WalletConnectIcon} onClick={() => { activate(WalletConnect) }} >
                                    <img src={WalletConnectIcon} alt="icon" />
                                </IconButton>
                                <IconButton className={classes.WalletConnectIcon} onClick={() => { activate(CoinbaseWallet) }}>
                                    <img src={CoinBaseIcon} alt="icon" />
                                </IconButton>
                            </Box>
                        </>
                    }
                    {
                        (codeInput && profileSet === PROFILE_STATUS.INIT) &&
                        <>
                            <Typography className={classes.CodeTitle}>Check your email</Typography>
                            <Typography className={classes.CodeSubTitle}>Please enter the code sent to <strong>{emailAddress}</strong></Typography>
                            <ReactCodeInput onComplete={completeVerifyCode} onChange={handleChangeCode} className={classes.CodeInput} />
                            <Typography sx={{ color: '#FFF' }} className={classes.CodeSubTitle}>Didn't receive code. <strong className={classes.ResendButton} onClick={handleResendCode}>Resend Now</strong></Typography>
                        </>
                    }
                    {
                        profileSet === PROFILE_STATUS.UNSET &&
                        <>
                            <Box className={classes.ModalInputBox}>
                                <input value={userNickName} onChange={(e) => setUserNickName(e.target.value)} className={classes.EmailInput} type="text"></input>
                            </Box>
                            <Box className={classes.ModalInputBox}>
                                <input disabled={campaignData.exist} value={promotionCode} placeholder="Promotion Code(optional)" onChange={(e) => setPromotionCode(e.target.value)} className={clsx(classes.EmailInput, classes.PromotionCode)} style={{ textAlign: 'left' }} type="text"></input>
                            </Box>
                            <Button className={clsx(classes.NextButton, classes.AuthButton)} onClick={handleProfileSet}>
                                <span>Start Game</span>
                            </Button>
                        </>
                    }
                </Box>
            </Box>
        </Modal>
    );
};

AuthenticationModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
};

export default AuthenticationModal;