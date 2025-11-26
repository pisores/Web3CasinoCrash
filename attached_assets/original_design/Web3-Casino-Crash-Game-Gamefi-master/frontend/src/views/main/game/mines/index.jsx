import { Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MinesPicker from "./utils/MinesPicker";
import MinesSocketManager from "./utils/MinesSocketManager";
import { useToasts } from "react-toast-notifications";
import clsx from "clsx";
import HistoryBox from "./utils/HistoryBox";
import { LoadingButton } from "@mui/lab";
import SettingBox from "views/components/setting";
import useSound from "use-sound";
import bgSound from "assets/sounds/bitkong/bg.mp3";
import clickSound from "assets/sounds/bitkong/cell-click.mp3";
import winSound from "assets/sounds/bitkong/cell-win.mp3";
import lostSound from "assets/sounds/bitkong/lost.mp3";
import profitSound from "assets/sounds/bitkong/profit.mp3";

const useStyles = makeStyles(() => ({
    MinesContainer: {
        width: '100%',
        paddingRight: '50px',
        "@media (max-width: 940px)": {
            padding: '0px'
        }
    },
    GamePanelBox: {
        width: '100%',
        height: '829px',
        borderRadius: '30px',
        backgroundImage: 'url("/assets/images/mines/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        position: 'relative',
        overflow: 'hidden',
        "@media (max-width: 940px)": {
            borderRadius: '0px',
        },
        "@media (max-width: 681px)": {
            height: '641px'
        }
    },
    WolfImage: {
        position: 'absolute',
        width: '346px',
        top: '249px',
        left: 'calc((100% - 284px) / 2 - 536px)'
    },
    ManImage: {
        position: 'absolute',
        width: '388px',
        top: '38px',
        right: 'calc((100% - 388px) / 2 - 432px)'
    },
    MinesGameBox: {
        position: 'absolute',
        backgroundImage: 'url("/assets/images/mines/MinesCardBg.png")',
        width: '500px',
        height: '658px',
        top: '85px',
        backgroundSize: 'cover',
        left: 'calc((100% - 500px) / 2)',
        padding: '26px 17px 0px 19px',
        "@media (max-width: 681px)": {
            width: '100%',
            left: '0px',
            backgroundSize: '100% 100%',
            height: '562px',
            padding: '22px 15px 0px'
        }
    },
    GamePlayContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0%',
        marginBottom: '14px'
    },
    CellContainer: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        marginBottom: '9px'
    },
    TableContainer: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr 1fr 1fr",
        gap: "3px",
        height: "367px",
        marginBottom: "12px",
        backgroundColor: '#3D2E69',
        padding: '3px',
        "@media (max-width: 681px)": {
            height: '314px',
            marginBottom: '10px'
        }
    },
    ActionBar: {
        display: 'flex',
        marginBottom: '8px',
        "@media (max-width: 681px)": {
            marginBottom: '7px',
        }
    },
    RandomCellButton: {
        width: '100%',
        height: '51px',
        backgroundImage: 'url("/assets/images/mines/RandomCellButton.png")',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "27px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#FFFFFF",
        "@media (max-width: 681px)": {
            height: '44px'
        }
    },
    InfoBar: {
        padding: "8px",
        lineHeight: "20px",
        WebkitBoxAlign: "center",
        alignItems: "center",
        display: "flex",
        backgroundImage: "url('/assets/images/mines/MultipleBackground.png')",
        width: '100%',
        height: '42px',
        backgroundSize: 'cover',
        justifyContent: 'space-between',
        "@media (max-width: 681px)": {
            height: '36px'
        }
    },
    OutComes: {
        display: 'flex'
    },
    OutComesDetail: {
        display: 'flex',
        alignItems: 'center',
        color: 'rgb(236, 250, 255)',
        "&>span": {
            marginLeft: '4px',
            marginRight: '8px',
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "20px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "&>img": {
            width: '16px',
            height: '16px'
        }
    },
    PayoutBox: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px',
        gap: '8px'
    },
    MultiplierBox: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "10px",
        lineHeight: "13px",
        textAlign: "right",
        textTransform: "uppercase",
        color: "#C68CFF",
        padding: "5px 7px",
        borderRadius: "5px",
        background: "#2C2C3A",
        WebkitBoxAlign: "center",
        alignItems: "center",
        display: "flex"
    },
    PayoutText: {
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: "19px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    AmountInfo: {
        display: 'flex',
        gap: '1px',
        alignItems: 'center',
        justifyContent: 'center',
        "&>span": {
            fontFamily: "'Styrene A Web'",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "18px",
            textTransform: "uppercase",
            color: "#FFFFFF"
        },
        "&>img": {
            width: '32px',
            height: '32px'
        }
    },
    GameActionBar: {
        display: 'flex',
        width: '100%',
        position: 'relative'
    },
    PlayButton: {
        height: '51px',
        backgroundImage: 'url("/assets/images/mines/PlayButton.png")',
        backgroundSize: 'cover',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "21px",
        lineHeight: "27px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        width: '100%',
        "@media (max-width: 681px)": {
            height: '44px'
        }
    },
    FinishButton: {
        background: 'rgb(151 95 239)',
        color: '#FFF'
    },
    CountSelectButton: {
        background: 'linear-gradient(rgb(106 76 217) 0%, rgb(180 108 251) 100%)',
        height: '50px',
        width: '50px',
        maxWidth: '50px',
        minWidth: '50px',
        marginLeft: '5px',
        color: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px',
        "&:disabled": {
            color: "rgb(183, 199, 208)",
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        },
        "@media (max-width: 681px)": {
            height: '44px',
            width: '44px',
            minWidth: '44px'
        }
    },
    CountSelect: {
        background: '#1f1e25',
        width: '40px',
        height: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        display: 'flex',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "20px",
        textTransform: "uppercase",
        color: "#FFFFFF"
    },
    BoardCell: {
        background: "rgb(40 40 54)",
        border: "1px solid #363646",
        borderRadius: "5px",
        display: "flex",
        WebkitBoxAlign: "center",
        alignItems: "center",
        WebkitBoxPack: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        opacity: 1,
        cursor: "pointer",
        transition: "opacity 0.3s ease 0s",
        padding: '0px',
        width: '89px',
        height: '70px',
        "&:hover": {
            background: 'rgb(31 30 37)',
            transition: "background 0.3s ease 0s"
        },
        "&:disabled:hover": {
            background: "rgb(40 40 54)",
        },
        "@media (max-width: 681px)": {
            width: '100%',
            height: '100%'
        }
    },
    BoardBackground: {
        backgroundImage: 'url("/assets/images/mines/NormalIcon.png")',
        backgroundSize: '50px 50px',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        width: "100%",
        height: "100%",
        position: "absolute",
        left: "0px",
        top: "0px",
        zIndex: 1,
    },
    BombCell: {
        borderColor: 'red'
    },
    UnSelect: {
        opacity: '0.5'
    },
    TakeBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        "&>label": {
            color: '#FFF'
        }
    },
    HistoryTable: {
        marginTop: '24px'
    },
    CoinItem: {
        marginLeft: '16px',
        width: '35px',
        marginTop: '3px'
    },
    AmountActionBox: {
        display: 'flex',
        height: '100%'
    },
    AmountActionButton: {
        padding: '0px',
        borderLeft: 'solid 1px #2c2c3a',
        "&:disabled": {
            color: "rgb(183, 199, 208)",
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        },
        backgroundColor: '#4D3C6A',
        width: '55px',
        minWidth: '55px',
        borderRadius: '0px',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        height: '100%'
    },
    AmountMiddleButton: {
        backgroundColor: '#734FA1'
    },
    AmountInputBox: {
        width: '100%',
        color: 'rgb(223, 245, 255)',
        flex: '1 1 0%',
        outline: 'none',
        background: 'transparent',
        border: 'none',
        fontWeight: '700',
        lineHeight: '1',
        margin: '0px 10px 0px 0px',
        fontSize: '24px',
        "&:disabled": {
            color: "rgb(183, 199, 208)",
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        },
        backgroundImage: 'url("/assets/images/mines/InputBg.png")',
        backgroundSize: '100% 100%',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        "@media (max-width: 681px)": {
            height: '39px'
        }
    },
    AmountInput: {
        width: 'calc(100% - 221px)',
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: "'Styrene A Web'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "17px",
        lineHeight: "21px",
        textTransform: "uppercase",
        color: "#FFFFFF",
        marginLeft: '5px'
    },
}));

const BoardRows = 5;
const BoardCols = 5;
const TotalCellCount = BoardRows * BoardCols;
const MinMinesCount = 2;
const MaxMinesCount = TotalCellCount - 1;

const Mines = () => {
    const setting = { max: 1000, min: 1 };
    const classes = useStyles();
    const dispatch = useDispatch();

    const [playBgSound, bgSoundOption] = useSound(bgSound);
    const [playClickSound] = useSound(clickSound);
    const [playWinSound] = useSound(winSound);
    const [playLostSound] = useSound(lostSound);
    const [playProfitSound] = useSound(profitSound);

    const { addToast } = useToasts();
    const authData = useSelector((state) => state.authentication);
    const currency = authData.isAuth ? authData.userData.currency : '';
    const settingData = useSelector((state) => state.settingOption);
    const [activeRound, setActiveRound] = useState();

    const [gamePlay, setGamePlay] = useState(false);
    const [roundResult, setRoundResult] = useState(null);
    const [betAmount, setBetAmount] = useState(10);

    const [minesCount, setMinesCount] = useState(MinMinesCount);
    const [diamondCount, setDiamondCount] = useState(0);

    const [nextPayout, setNextPayout] = useState(1);
    const [curPayout, setCurPayout] = useState(1);

    const [countPickerShow, setCountPickerShow] = useState(false);

    const [pickCellRes, setPickCellRes] = useState();
    const [cellPicked, setCellPicked] = useState(false);

    const [boardData, setBoardData] = useState(Array.from(Array(BoardRows), () => Array(BoardCols).fill(0)));
    const [selectData, setSelectData] = useState(Array.from(Array(BoardRows), () => Array(BoardCols).fill(false)))

    const payoutAmount = Number(betAmount * curPayout).toFixed(6);
    const nextPayoutAmount = Number(betAmount * nextPayout).toFixed(2);

    const [playLoading, setPlayLoading] = useState(false);
    const [endLoading, setEndLoading] = useState(false);

    useEffect(() => {
        MinesSocketManager.getInstance().connect(authData);
        window.addEventListener('message', onWindowMessage);
        return () => {
            MinesSocketManager.getInstance().disconnect();
            window.removeEventListener('message', onWindowMessage);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (settingData.sound && settingData.backgroundSound) {
            playBgSound();
        }
        if (!settingData.sound || !settingData.backgroundSound) {
            bgSoundOption.pause();
        }
        return () => {
            bgSoundOption.stop();
        }
        // eslint-disable-next-line
    }, [settingData]);

    useEffect(() => {
        if (authData.isAuth) {
            MinesSocketManager.getInstance().getActiveRound({ userId: authData.userData._id });
        }
        // eslint-disable-next-line
    }, [authData]);

    useEffect(() => {
        if (activeRound) {
            if (activeRound.roundResult === "") {
                let board = boardData;
                // eslint-disable-next-line
                activeRound.selectBoard.map((colData, i) => {
                    // eslint-disable-next-line
                    colData.map((rowData, j) => {
                        if (rowData)
                            board[i][j] = activeRound.resultBoard[i][j] ? 2 : 1;
                    });
                });
                setBoardData([...board]);
                setSelectData(activeRound.selectBoard);

                setGamePlay(true);
                setCurPayout(activeRound.currentPayout);
                setNextPayout(activeRound.nextPayout);

                setMinesCount(activeRound.minesCount);
                setDiamondCount(activeRound.diamondCount);

                setBetAmount(activeRound.betAmount);
                setCellPicked(activeRound.cellPicked);
            }
        }
        // eslint-disable-next-line
    }, [activeRound]);

    useEffect(() => {
        if (minesCount >= MinMinesCount) {
            setCountPickerShow(false);
        }
        // eslint-disable-next-line
    }, [minesCount]);

    useEffect(() => {
        if (betAmount < 1) {
            setBetAmount(1);
            return;
        }
        // eslint-disable-next-line
    }, [curPayout, betAmount]);

    useEffect(() => {
        if (pickCellRes && pickCellRes.status) {
            const { i, j, info } = pickCellRes;

            if (!info) playEffectSound(playWinSound);
            // else playEffectSound(playLostSound);

            let board = boardData;
            board[i][j] = info ? 2 : 1;
            setBoardData([...board]);

            let select = selectData;
            select[i][j] = true;
            setSelectData([...select]);

            setCellPicked(true);
            setDiamondCount(pickCellRes.diamondCount);

            setCurPayout(pickCellRes.currentPayout);
            setNextPayout(pickCellRes.nextPayout);
        }
        // eslint-disable-next-line
    }, [pickCellRes]);

    useEffect(() => {
        if (roundResult !== null) {
            let board = boardData;
            for (let i = 0; i < BoardRows; i++) {
                for (let j = 0; j < BoardCols; j++) {
                    if (!roundResult.resultBoard[i][j])
                        board[i][j] = 1;
                }
            }
            setBoardData([...board]);
            setSelectData([...roundResult.selectBoard]);

            if (roundResult.roundResult !== 'lost') {
                playEffectSound(playProfitSound);
            }
            else {
                playEffectSound(playLostSound);
            }

            if (roundResult.roundResult !== '') {
                setNextPayout(0);
                setCurPayout(0);
            }
            if (roundResult.hasOwnProperty('balanceData')) {
                dispatch({ type: 'SET_BALANCEDATA', data: roundResult.balanceData.data });
            }
        }
        // eslint-disable-next-line
    }, [roundResult]);

    const onWindowMessage = (event) => {
        if (event?.data?.type === 'playzelo-mines-joinBetResult') {
            const response = event.data.data;
            setPlayLoading(false);
            if (response.status) {
                setGamePlay(true);
                setRoundResult(null);
                setCellPicked(false);
                setCurPayout(response.currentPayout);
                setNextPayout(response.nextPayout);
                if (response.hasOwnProperty('balanceData'))
                    dispatch({ type: 'SET_BALANCEDATA', data: response.balanceData.data });
            }
            else {
                addToast(response.message, { appearance: 'error', autoDismiss: true });
            }
        }
        if (event?.data?.type === 'playzelo-mines-pickCellResult') {
            setPickCellRes({ ...event.data.data });
        }
        if (event?.data?.type === 'playzelo-mines-roundResult') {
            setEndLoading(false);
            setGamePlay(false);
            setRoundResult(event.data.data);
        }
        if (event?.data?.type === 'playzelo-mines-activeRoundResult') {
            if (event.data.data.status) {
                setActiveRound(event.data.data.roundData);
            }
        }
    };

    const handleBetAmount = (e) => {
        e.preventDefault();
        setBetAmount(e.target.value);
    };

    const handleCountPicker = () => {
        playEffectSound(playClickSound);
        setCountPickerShow(!countPickerShow);
    };

    const handleJoinBet = () => {
        if (!authData.isAuth) {
            addToast('Please login and try again.', { appearance: 'error', autoDismiss: true });
            return;
        }
        setBoardData(Array.from(Array(BoardRows), () => Array(BoardCols).fill(0)));
        setSelectData(Array.from(Array(BoardRows), () => Array(BoardCols).fill(false)));
        setDiamondCount(0);
        playEffectSound(playClickSound);
        const request = {
            userId: authData?.userData?._id,
            betAmount: betAmount,
            coinType: currency,
            minesCount: minesCount
        };
        MinesSocketManager.getInstance().joinBet(request);
        setPlayLoading(true);
    };

    const handleFinishBet = () => {
        if (gamePlay) {
            playEffectSound(playClickSound);
            MinesSocketManager.getInstance().finishBet({ userId: authData.userData._id });
            setEndLoading(true);
        }
    };

    const handlePickCell = (i, j) => {
        if (gamePlay) {
            if (boardData[i][j] === 0) {
                playEffectSound(playClickSound);
                const request = { userId: authData?.userData?._id, i, j };
                MinesSocketManager.getInstance().pickCell(request);
            }
        }
    };

    const playEffectSound = (soundPlay) => {
        if (settingData.sound && settingData.effectSound) {
            soundPlay();
        }
    };

    const handleRandomPick = () => {
        if (!gamePlay) return;

        let flag = true;
        while (flag) {
            let i = Math.floor(Math.random() * BoardCols);
            let j = Math.floor(Math.random() * BoardRows);
            if (boardData[i][j] === 0) {
                flag = false;
                handlePickCell(i, j);
            }
        }
    };

    const handleAmountAction = (type) => {
        switch (type) {
            case 0:
                setBetAmount(betAmount / 2);
                break;
            case 1:
                setBetAmount(betAmount * 2);
                break;
            case 2:
                setBetAmount(setting.max);
                break;
            default:
                break;
        }
    };

    return (
        <Box className={classes.MinesContainer}>
            <Box className={classes.GamePanelBox}>
                <SettingBox />
                <img src="/assets/images/mines/cat.png" alt="cat" className={classes.WolfImage} />
                <img src="/assets/images/mines/woman.png" alt="woman" className={classes.ManImage} />
                <Box className={classes.MinesGameBox}>
                    <Box className={classes.GamePlayContainer}>
                        <Box className={classes.CellContainer}>
                            <Box className={classes.TableContainer}>
                                {
                                    boardData.map((colsData, i) => {
                                        return (
                                            colsData.map((rowData, j) => {
                                                return (
                                                    <Button
                                                        key={j + i * BoardRows}
                                                        className={clsx(classes.BoardCell, rowData === 2 ? classes.BombCell : '', !selectData[i][j] ? classes.UnSelect : '')}
                                                        disabled={!gamePlay}
                                                        onClick={() => handlePickCell(i, j)}
                                                    >
                                                        {
                                                            rowData === 0 && <i className={classes.BoardBackground}></i>
                                                        }
                                                        {
                                                            rowData === 1 && <img src={"/assets/images/mines/DiamondIcon.png"} width="55px" height="51px" alt="icon" />
                                                        }
                                                        {
                                                            rowData === 2 && <img src={"/assets/images/mines/BombIcon.png"} width="50px" height="49px" alt="icon" />
                                                        }
                                                    </Button>
                                                )
                                            })
                                        )
                                    })
                                }
                            </Box>
                            <Box className={classes.ActionBar}>
                                <Button className={classes.RandomCellButton} disabled={!gamePlay} onClick={handleRandomPick}>Pick Random Cell</Button>
                            </Box>
                            <Box className={classes.InfoBar}>
                                <Box className={classes.OutComes}>
                                    <Box className={classes.OutComesDetail}>
                                        <img src="/assets/images/mines/BombIcon.png" alt="icon" />
                                        <span>{minesCount}</span>
                                    </Box>
                                    <Box className={classes.OutComesDetail}>
                                        <img src="/assets/images/mines/DiamondIcon.png" alt="icon" />
                                        <span>{TotalCellCount - minesCount - diamondCount}</span>
                                    </Box>
                                </Box>
                                <Box className={classes.PayoutBox}>
                                    <span className={classes.PayoutText}>Next multiplier</span>
                                    <Box className={classes.MultiplierBox}>x<span>{nextPayout.toFixed(2)}</span></Box>
                                </Box>
                                <Box className={classes.AmountInfo}>
                                    <img src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt="coin icon" />
                                    <span>{Number(nextPayoutAmount).toFixed(2)}</span>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.GameActionBar}>
                            {
                                !gamePlay ?
                                    <LoadingButton className={classes.PlayButton} loading={playLoading} onClick={handleJoinBet}>
                                        Play
                                    </LoadingButton>
                                    :
                                    <LoadingButton loading={endLoading} className={clsx(classes.PlayButton, classes.FinishButton)} onClick={handleFinishBet}>
                                        {
                                            !cellPicked && <span>End</span>
                                        }
                                        {
                                            cellPicked && <Box className={classes.TakeBox}>Take <img alt="icon" src={`/assets/images/coins/${currency.coinType.toLowerCase()}.png`} width="24px" height="24px" /> <label>{payoutAmount}</label></Box>
                                        }
                                    </LoadingButton>
                            }
                            <Button className={classes.CountSelectButton} onClick={handleCountPicker} disabled={gamePlay}>
                                <Box className={classes.CountSelect}>{minesCount}</Box>
                            </Button>
                            {
                                countPickerShow &&
                                <MinesPicker minMinesCount={MinMinesCount} maxMinesCount={MaxMinesCount} minesCount={minesCount} setMinesCount={setMinesCount} />
                            }
                        </Box>
                    </Box>
                    <Box className={classes.AmountInputBox}>
                        <img src={`/assets/images/coins/${currency?.coinType?.toLowerCase()}.png`} alt="zelo" className={classes.CoinItem} />
                        <input className={classes.AmountInput} type="number" value={betAmount} onChange={handleBetAmount} />
                        <Box className={classes.AmountActionBox}>
                            <Button onClick={() => handleAmountAction(0)} className={classes.AmountActionButton}>1/2</Button>
                            <Button onClick={() => handleAmountAction(1)} className={clsx(classes.AmountActionButton, classes.AmountMiddleButton)}>2X</Button>
                            <Button onClick={() => handleAmountAction(2)} className={classes.AmountActionButton}>Max</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.HistoryTable}>
                <HistoryBox />
            </Box>
        </Box>
    );
};

export default Mines;