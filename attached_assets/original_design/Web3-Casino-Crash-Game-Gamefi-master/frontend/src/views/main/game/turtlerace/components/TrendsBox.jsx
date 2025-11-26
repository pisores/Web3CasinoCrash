import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";

const useStyles = makeStyles(() => ({
    TrendsBoxContainer: {
        display: 'grid',
        gridGap: '1px',
        gridTemplateRows: 'repeat(6, 1fr)',
        gridTemplateColumns: 'repeat(11, 1fr)',
        backgroundImage: 'url("/assets/images/turtle/TrendBG.png")',
        backgroundSize: '100% 100%',
        width: '333px',
        height: '179px'
    },
    TrendsItem: {
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const XCOUNT = 11;
const YCOUNT = 6;

const TrendsBox = () => {
    const classes = useStyles();
    const [trendsArray, setTrendsArray] = useState([]);

    useEffect(() => {
        window.addEventListener('message', onWindowMessage);
        return () => {
            window.removeEventListener('message', onWindowMessage);
        };
    }, []);

    const CircleItem = ({ length, color }) => {
        return (
            <Box style={{ width: `${length}px`, height: `${length}px`, background: `${color}`, borderRadius: '50%' }}></Box>
        );
    };

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-currentRoundResult') {
            const historyData = event?.data?.data;
            let trends = new Array(XCOUNT * YCOUNT).fill(null);
            let currentWinPos;
            let currentWinLength = 0;
            let xPosition = 10;
            for (let index = 0; index < historyData.length; index++) {
                let winPos = historyData[index].winnerInfo.findIndex((item) => item === 0);
                let pushPos = 0;
                if (index === 0) {
                    currentWinPos = winPos;
                    pushPos = currentWinLength * XCOUNT + xPosition;
                }
                else {
                    if (winPos === currentWinPos) {
                        currentWinLength++;
                        if(currentWinLength >= YCOUNT) {
                            pushPos = (YCOUNT - 1) * XCOUNT + xPosition + currentWinLength - YCOUNT + 1;
                        }
                        else {
                            pushPos = currentWinLength * XCOUNT + xPosition;
                        }
                    }
                    else {
                        currentWinLength = 0;
                        currentWinPos = winPos;
                        xPosition--;
                        pushPos = currentWinLength * XCOUNT + xPosition;
                    }
                }
                trends[pushPos] = winPos;
                if (xPosition < 0) {
                    break;
                }
            }
            setTrendsArray([...trends]);
        }
    }

    return (
        <Box className={classes.TrendsBoxContainer}>
            {
                trendsArray.map((item, index) => {
                    return (
                        <Box key={index} className={classes.TrendsItem}>
                            {
                                item !== null &&
                                <CircleItem length={22} color={item === 0 ? '#ff9314' : item === 1 ? '#f23068' : '#0d42ff'} />
                            }
                        </Box>
                    )
                })
            }
        </Box>
    );
};

export default TrendsBox;