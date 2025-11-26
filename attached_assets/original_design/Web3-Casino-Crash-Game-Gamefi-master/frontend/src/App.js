import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import themes from "./themes";
import { LoadingProvider } from "./layout/Context/loading";
import ContextLoading from "./ui-component/loading";
import MainRoutes from "./routes/main";
import { GoogleOAuthProvider } from '@react-oauth/google'
import chatRoomConnect from "redux/actions/chat";
import baseInit from "redux/actions/base";

const App = () => {
    const customization = useSelector((state) => state.customization);
    chatRoomConnect();
    baseInit();

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <LoadingProvider>
                        <ContextLoading />
                        <MainRoutes />
                    </LoadingProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </GoogleOAuthProvider>
    )
};

export default App;