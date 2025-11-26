import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Turtle_Red_Idle from "assets/images/turtle_red_idle.png";
import Turtle_Red_Run from "assets/images/turtle_red_run.png";
import Turtle_Blue_Idle from "assets/images/turtle_blue_idle.png";
import Turtle_Blue_Run from "assets/images/turtle_blue_run.png";
import Turtle_Yellow_Idle from "assets/images/turtle_yellow_idle.png";
import Turtle_Yellow_Run from "assets/images/turtle_yellow_run.png";
import { useSelector } from "react-redux";
import useSound from "use-sound";
import bgSound from "assets/sounds/turtle/bg.mp3";

const useStyles = makeStyles(() => ({
    AnimationBox: {
        display: 'flex',
        width: '100%',
        margin: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'column',
        position: 'relative',
        "@media (max-width: 1444px)": {
            padding: '0px 32px',
            gap: 19
        }
    },
    AnimationLine: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: '150px',
        width: '100%',
        "@media (max-width: 1444px)": {
            height: 68.65
        }
    },
    TurtleSVG: {
        width: '99px',
        height: '72px',
        marginLeft: '0px'
    },
    AnimationTurtleSvg: {
        width: '97px',
        height: '67px'
    },
    FlagBox: {
        position: 'relative',
        marginLeft: 'auto',
        "&>img": {
            height: '100px',
            width: '74px',
            "@media (max-width: 1444px)": {
                width: 50,
                height: 67
            }
        },
        "&>span": {
            color: '#FFF',
            fontSize: '22px',
            fontWeight: 'bold',
            position: 'absolute',
            bottom: '16px',
            left: '10px'
        }
    },
    CountDownTitle: {
        marginTop: '12px',
        fontSize: '21px',
        lineHeight: '26px',
        textTransform: 'uppercase',
        fontWeight: '900',
        "@media (max-width: 1444px)": {
            fontSize: '14px',
            lineHeight: '18px'
        }
    },
    CountDownTime: {
        fontSize: '126px',
        lineHeight: '160px',
        fontWeight: '900',
        "@media (max-width: 1444px)": {
            fontSize: '88px',
            lineHeight: '112px'
        }
    },
    PrevWinnerBox: {
        width: '100%',
        height: '92px',
        background: 'url("/assets/images/turtle/PrevWinner_bg.png")',
        flex: 'none',
        boxShadow: '0 -4px 14px #180844',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Styrene A Web',
        "&>span": {
            fontSize: '21px',
            lineHeight: '27px',
            color: '#fff',
            fontWeight: '900',
            "@media (max-width: 1444px)": {
                fontSize: '14px',
                lineHeight: '18px'
            }
        },
        "&>img": {
            width: '90px',
            marginLeft: '16px',
            "@media (max-width: 1444px)": {
                width: '64px',
                marginLeft: '10px'
            }
        },
        "@media (max-width: 1444px)": {
            height: '65px'
        }
    },
    CountDownBox: {
        background: 'url("/assets/images/turtle/CountDown_Bg.png")',
        width: '367px',
        height: '198px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: "absolute",
        top: "0px",
        margin: 'auto',
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        left: '0px',
        right: '0px',
        fontFamily: 'Styrene A Web',
        color: '#FFF',
        "@media (max-width: 1444px)": {
            width: '259px',
            height: '140px'
        }
    },
    ResultNumber: {
        position: 'absolute',
        top: '15px',
        left: '-20px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 900,
        fontSize: "21px",
        lineHeight: "27px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        "@media (max-width: 1444px)": {
            width: 22,
            height: 22,
            fontSize: 14,
            lineHeight: 18
        }
    },
    YellowBox: {
        backgroundColor: '#E1B600'
    },
    RedBox: {
        backgroundColor: '#E40253'
    },
    BlueBox: {
        backgroundColor: '#005CF3'
    },
    FirstAnimation: {
        transition: 'margin 9s ease-out',
        marginLeft: 'calc(100% - 162px - 50px - 20px - 162px) !important',
        "@media (max-width: 1444px)": {
            marginLeft: 'calc(100% - 96.6px - 50px - 20px - 96.6px) !important'
        }
    },
    SecondAnimation: {
        transition: 'margin 9.5s ease-out',
        marginLeft: 'calc(100% - 162px - 50px - 20px - 162px) !important',
        "@media (max-width: 1444px)": {
            marginLeft: 'calc(100% - 96.6px - 50px - 20px - 96.6px) !important'
        }
    },
    ThirdAnimation: {
        transition: 'margin 10s ease-out',
        marginLeft: 'calc(100% - 162px - 50px - 20px - 162px) !important',
        "@media (max-width: 1444px)": {
            marginLeft: 'calc(100% - 96.6px - 50px - 20px - 96.6px) !important'
        }
    },
    TurtleYellowIdle: {
        width: 156,
        "@media (max-width: 1444px)": {
            width: 93
        }
    },
    TurtleYellowRun: {
        width: 158,
        marginTop: 30,
        marginLeft: -158,
        "@media (max-width: 1444px)": {
            width: 94.2,
            marginLeft: -94.2,
            marginTop: 16
        }
    },
    TurtleRedIdle: {
        width: 156,
        "@media (max-width: 1444px)": {
            width: 93
        }
    },
    TurtleRedRun: {
        width: 159,
        marginTop: 30,
        marginLeft: -159,
        "@media (max-width: 1444px)": {
            width: 94.8,
            marginLeft: -94.8,
            marginTop: 16
        }
    },
    TurtleBlueIdle: {
        width: 158,
        "@media (max-width: 1444px)": {
            width: 94.2
        }
    },
    TurtleBlueRun: {
        width: 162,
        marginTop: 30,
        marginLeft: -162,
        "@media (max-width: 1444px)": {
            width: 96.6,
            marginLeft: -96.6,
            marginTop: 16
        }
    }
}));

let loadingData = [false, false, false];

const AnimationBox = () => {
    const classes = useStyles();
    const settingData = useSelector((state) => state.settingOption);
    const animation = settingData.animation;

    const [playBgSound, bgSoundOption] = useSound(bgSound);

    const [roundState, setRoundState] = useState();
    const [turtleState, setTurtleState] = useState('idle');
    const [imageLoaded, setImageLoad] = useState(loadingData);

    const [countDownTime, setCountDownTime] = useState(0);
    const [winner, setWinner] = useState(0);
    const [roundResult, setRoundResult] = useState([1, 1, 1]);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        return () => {
            window.removeEventListener('message', onWindowMessage);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (settingData.sound && settingData.backgroundSound) {
            playBackgroundSound(playBgSound);
        }
        if (!settingData.sound || !settingData.backgroundSound) {
            stopSound(bgSoundOption);
        }
        return () => {
            stopSound(bgSoundOption);
        }
        // eslint-disable-next-line
    }, [settingData]);

    useEffect(() => {
        if (roundState === 'countdown') {
            removeTurtleAnimation();
            setTurtleState('idle');
            // loadingData = [false, false, false];
            setImageLoad(loadingData);
        }
        else {
            setTurtleState('run');
        }

        // eslint-disable-next-line
    }, [roundState]);

    useEffect(() => {
        if (animation && roundState === 'started' && imageLoaded[0] && imageLoaded[1] && imageLoaded[2]) {
            runTurtleAnimation(roundResult);
        }
        // eslint-disable-next-line
    }, [imageLoaded, roundState]);

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-countDown') {
            setCountDownTime(Number(event.data.data));
            setRoundState('countdown');
        }
        if (event?.data?.type === 'playzelo-roundStart') {
            setRoundState('started');
            setRoundResult(event.data.data);
        }
        if (event?.data?.type === 'playzelo-roundStop') {
            setRoundState('finished');
            setRoundResult(event.data.data);
            const winnerPos = event.data.data.findIndex((item) => item === 0);
            setWinner(winnerPos);
        }
        if (event?.data?.type === 'playzelo-currentRoundState') {
            const stateData = event.data.data;
            if (stateData.state === 'started') {
                setRoundState('running');
            }
            else if (stateData.state === 'finished') {
            }
        }
    };

    const runTurtleAnimation = (result) => {
        switch (result[0]) {
            case 0:
                document.getElementById("Turtle-Yellow").classList.add(classes.FirstAnimation);
                break;
            case 1:
                document.getElementById("Turtle-Yellow").classList.add(classes.SecondAnimation);
                break;
            case 2:
                document.getElementById("Turtle-Yellow").classList.add(classes.ThirdAnimation);
                break;
            default:
                break;
        }
        switch (result[1]) {
            case 0:
                document.getElementById("Turtle-Red").classList.add(classes.FirstAnimation);
                break;
            case 1:
                document.getElementById("Turtle-Red").classList.add(classes.SecondAnimation);
                break;
            case 2:
                document.getElementById("Turtle-Red").classList.add(classes.ThirdAnimation);
                break;
            default:
                break;
        }
        switch (result[2]) {
            case 0:
                document.getElementById("Turtle-Blue").classList.add(classes.FirstAnimation);
                break;
            case 1:
                document.getElementById("Turtle-Blue").classList.add(classes.SecondAnimation);
                break;
            case 2:
                document.getElementById("Turtle-Blue").classList.add(classes.ThirdAnimation);
                break;
            default:
                break;
        }
    };

    const removeTurtleAnimation = () => {
        document.getElementById("Turtle-Yellow").classList.remove(classes.FirstAnimation);
        document.getElementById("Turtle-Yellow").classList.remove(classes.SecondAnimation);
        document.getElementById("Turtle-Yellow").classList.remove(classes.ThirdAnimation);
        document.getElementById("Turtle-Red").classList.remove(classes.FirstAnimation);
        document.getElementById("Turtle-Red").classList.remove(classes.SecondAnimation);
        document.getElementById("Turtle-Red").classList.remove(classes.ThirdAnimation);
        document.getElementById("Turtle-Blue").classList.remove(classes.FirstAnimation);
        document.getElementById("Turtle-Blue").classList.remove(classes.SecondAnimation);
        document.getElementById("Turtle-Blue").classList.remove(classes.ThirdAnimation);
    };

    const handleLoad = (index) => {
        loadingData[index] = true;
        setImageLoad([...loadingData]);
    };

    const playBackgroundSound = (soundPlay) => {
        if (settingData.sound && settingData.backgroundSound) {
            soundPlay();
        }
    }

    const stopSound = (playOption) => {
        playOption.stop();
    };

    return (
        <Box className={classes.AnimationBox}>
            {
                roundState === 'countdown' &&
                <Box className={classes.CountDownBox}>
                    <span className={classes.CountDownTitle}>Place a bet now!</span>
                    <span className={classes.CountDownTime}>{countDownTime}</span>
                    <Box className={classes.PrevWinnerBox}>
                        <span>Previous Winner</span>
                        <img src={`/assets/images/turtle/Turtle_${winner === 0 ? 'Yellow' : winner === 1 ? 'Red' : 'Blue'}.png`} style={{ transform: 'transition .3s ease-in-out' }} alt='icon' />
                    </Box>
                </Box>
            }
            {
                roundState === 'running' &&
                <Box className={classes.CountDownBox} style={{ top: '100px' }}>
                    <span className={classes.CountDownTitle} style={{ marginTop: '80px' }}>Waiting For Next round!</span>
                </Box>
            }
            <Box className={classes.AnimationLine}>
                <img
                    src={Turtle_Yellow_Idle}
                    alt="turtle"
                    className={classes.TurtleYellowIdle}
                    style={{ opacity: turtleState === 'idle' ? 1 : 0 }}
                />
                <img
                    id="Turtle-Yellow"
                    src={Turtle_Yellow_Run}
                    alt="turtle"
                    className={classes.TurtleYellowRun}
                    style={{ opacity: turtleState === 'run' ? 1 : 0 }}
                    onLoad={() => handleLoad(0)}
                />
                <Box className={classes.FlagBox}>
                    <img src={"/assets/images/turtle/Flag_Yellow.png"} alt='flag' />
                    {
                        roundState === 'finished' &&
                        <Box className={clsx(classes.ResultNumber, classes.YellowBox)}>{roundResult[0] + 1}</Box>
                    }
                </Box>
            </Box>
            <Box className={classes.AnimationLine}>
                <img
                    src={Turtle_Red_Idle}
                    alt="turtle"
                    className={classes.TurtleRedIdle}
                    style={{ opacity: turtleState === 'idle' ? 1 : 0 }}
                />
                <img
                    id="Turtle-Red"
                    src={Turtle_Red_Run}
                    alt="turtle"
                    className={classes.TurtleRedRun}
                    style={{ opacity: turtleState === 'run' ? 1 : 0 }}
                    onLoad={() => handleLoad(1)}
                />
                <Box className={classes.FlagBox}>
                    <img src={"/assets/images/turtle/Flag_Red.png"} alt='flag' />
                    {
                        roundState === 'finished' &&
                        <Box className={clsx(classes.ResultNumber, classes.RedBox)}>{roundResult[1] + 1}</Box>
                    }
                </Box>
            </Box>
            <Box className={classes.AnimationLine}>
                <img
                    src={Turtle_Blue_Idle}
                    alt="turtle"
                    className={classes.TurtleBlueIdle}
                    style={{ opacity: turtleState === 'idle' ? 1 : 0 }}
                />
                <img
                    id="Turtle-Blue"
                    src={Turtle_Blue_Run}
                    alt="turtle"
                    className={classes.TurtleBlueRun}
                    style={{ opacity: turtleState === 'run' ? 1 : 0 }}
                    onLoad={() => handleLoad(2)}
                />
                <Box className={classes.FlagBox}>
                    <img src={"/assets/images/turtle/Flag_Blue.png"} alt='flag' />
                    {
                        roundState === 'finished' &&
                        <Box className={clsx(classes.ResultNumber, classes.BlueBox)}>{roundResult[2] + 1}</Box>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default AnimationBox;