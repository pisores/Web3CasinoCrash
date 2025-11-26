import { Box } from "@mui/material";
import { useEffect } from "react";
import TurtleSocketManager from "./TurtleSocketManager";
import { useSelector } from "react-redux";
import GamePanel from "./components/GamePanel";
import BetInputBox from "./components/BetInputBox";
import AnimationBox from "./components/AnimationBox";
import { makeStyles } from "@mui/styles";
import HistoryBox from "./components/HistoryBox";
import SettingBox from "views/components/setting";

const useStyles = makeStyles(() => ({
    TurtleLayout: {
        width: '100%',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            padding: '0px'
        }
    },
    TurtleGameLayout: {
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: '16px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundImage: 'url("/assets/images/turtle/Main_Bg.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '829px',
        padding: '22px 0px 0px 22px',
        borderRadius: '30px',
        position: 'relative',
        "@media (max-width: 1444px)": {
            padding: '0px',
            borderRadius: '0px',
            height: 520
        }
    },
    HistoryBox: {
        margin: '24px auto 0',
        color: '#f0ecff'
    },
    AnimationBox: {
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        padding: '24px 32px 0px',
        flexDirection: 'column',
        width: '100%',
        "@media (max-width: 1444px)": {
            padding: '24px 0px 0px'
        }
    }
}));

const TurterlaceWidget = () => {
    const authData = useSelector((state) => state.authentication);
    const classes = useStyles();

    useEffect(() => {
        TurtleSocketManager.getInstance().connect(authData);
        return () => {
            TurtleSocketManager.getInstance().disconnect();
        };
        // eslint-disable-next-line
    }, []);

    return (
        <Box className={classes.TurtleLayout}>
            <Box className={classes.TurtleGameLayout}>
                <SettingBox />
                <GamePanel />
                <Box className={classes.AnimationBox}>
                    <AnimationBox />
                    <BetInputBox />
                </Box>
            </Box>
            <Box className={classes.HistoryBox}>
                <HistoryBox />
            </Box>
        </Box>
    );
};

export default TurterlaceWidget;