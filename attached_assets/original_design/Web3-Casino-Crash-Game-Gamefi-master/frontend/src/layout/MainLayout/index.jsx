import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import MainHeader from "./header";
import MainMenu from "./menu";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import MainFooter from "./footer";
import Config from "config/index";
import { useEffect } from "react";
import { getMyBalances } from "redux/actions/auth";
import { useToasts } from "react-toast-notifications";
import { getAuthData, getPrivacyData } from "redux/actions/auth";

const useStyles = makeStyles(() => ({
    MainContainer: {
        overflowY: 'auto',
        width: '100%',
        transition: 'transform .3s ease-in-out,margin .3s ease-in-out,-webkit-transform .3s ease-in-out',
        "&>section": {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    RemovedMenu: {
        marginLeft: '60px'
    },
    MainWrapper: {
        paddingTop: '107px',
        display: 'flex',
        "@media (max-width: 681px)": {
            paddingTop: '63px'
        }
    }
}));

const MainLayout = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { addToast } = useToasts();

    const authData = useSelector((state) => state.authentication);
    const menuOption = useSelector((state) => state.menuOption);

    useEffect(() => {
        const checkAuthentication = async () => {
            if (!authData.isAuth) {
                const token = Config.Api.getToken();
                if (token !== null) {
                    const response = await getAuthData({ token });
                    if (response.status) {
                        dispatch({ type: 'SET_AUTH' });
                        dispatch({ type: 'SET_USERDATA', data: response.data });
                        dispatch({ type: 'SET_BALANCEDATA', data: response.data.balance.data });

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
                }
            }
        }
        checkAuthentication();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        Config?.Root?.socket?.off("balanceUpdated");
        Config?.Root?.socket?.on("balanceUpdated", (data) => {
            if (data._id === authData?.userData?._id) {
                dispatch({ type: 'SET_BALANCEDATA', data: data.balance.data });
            }
        });
        console.log(authData);
        // eslint-disable-next-line
    }, [authData]);

    useEffect(() => {
        if (authData.isAuth) {
            Config?.Root?.socket?.off("depositSuccess");
            Config?.Root?.socket?.on("depositSuccess", (data) => {
                console.log(data);
                if (data.id === authData?.userData?._id) {
                    addToast('Deposit Successfully Completed', { appearance: 'success', autoDismiss: true });
                    loadBalanceData();
                }
            });
            const checkPrivacyData = async () => {
                const response = await getPrivacyData({ userId: authData.userData._id });
                if (response.status) {
                    const data = {
                        privateProfile: response.data.privateProfile,
                        showOnlineIndicator: response.data.showOnlineIndicator
                    };
                    dispatch({ type: 'INIT_PRIVACY', data });
                }
            };
            checkPrivacyData();
        }
        // eslint-disable-next-line
    }, [authData.isAuth]);

    const loadBalanceData = async () => {
        const request = { userId: authData?.userData?._id };
        const response = await getMyBalances(request);
        if (response.status) {
            dispatch({ type: 'SET_BALANCEDATA', data: response.data.data });
        }
        else {
            addToast(response.message, { appearance: 'error', autoDismiss: true });
        }
    }

    return (
        <Box
        >
            <CssBaseline />
            <MainHeader />
            <Box className={classes.MainWrapper}>
                {/* <MainMenu /> */}
                <main className={!menuOption.menuVisible ? clsx(classes.MainContainer, 'NoScroll') : clsx(classes.MainContainer, classes.RemovedMenu, 'NoScroll')}>
                    <section>
                        <Outlet />
                    </section>
                </main>
            </Box>
            <MainFooter />
        </Box>
    );
};

export default MainLayout;