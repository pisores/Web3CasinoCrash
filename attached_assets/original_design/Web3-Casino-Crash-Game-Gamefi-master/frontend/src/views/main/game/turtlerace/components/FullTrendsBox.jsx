import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { useEffect } from "react";

const useStyles = makeStyles(() => ({
    // TrendsBoxContainer: {
    //     display: 'grid',
    //     gridGap: '1px',
    //     gridTemplateRows: 'repeat(6, 22px)',
    //     gridTemplateColumns: 'repeat(11, 1fr)',
    //     marginTop: '24px',
    //     transform: 'rotate(180deg)'
    // },
    // TrendsItem: {
    //     backgroundColor: '#311c6d',
    //     padding: '2px'
    // }
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

const FullTrendsBox = () => {
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
            <Box style={{ width: `${length}px`, height: `${length}px`, borderRadius: '50%', border: `solid 5px ${color}` }}></Box>
        );
    };

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-currentRoundResult') {
            const historyData = event?.data?.data;
            let trends = new Array(XCOUNT * YCOUNT).fill(null);
            let length = historyData.length > XCOUNT * YCOUNT ? XCOUNT * YCOUNT : historyData.length;
            for (let index = 0; index < length; index++) {
                let winPos = historyData[index].winnerInfo.findIndex((item) => item === 0);
                let trendPosition = index % YCOUNT * XCOUNT + Math.floor(index / YCOUNT);
                trends[trendPosition] = winPos;
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

export default FullTrendsBox;