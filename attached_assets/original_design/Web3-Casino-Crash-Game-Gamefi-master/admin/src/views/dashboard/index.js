import { Grid } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { loadDashBoardData } from "redux/action/report";
import { useSelector } from "react-redux";
import PlayerCard from "./playerCard";
import { LoadingContext } from "layout/Context/loading";
import TurtleCard from "./turtleCard";
import ScissorCard from "./scissorCard";
import WalletCard from "./walletCard";
import MinesCard from "./minesCard";
import DiceCard from "./diceCard";
import PlinkoCard from "./plinkoCard";

const Dashboard = () => {
    const userAuth = useSelector((state) => state.userAuth);
    const [playerCount, setPlayerCount] = useState(0);
    const [turtleCount, setTurtleCount] = useState(0);
    const [scissorCount, setScissorCount] = useState(0);
    const [minesCount, setMinesCount] = useState(0);
    const [walletCount, setWalletCount] = useState(0);
    const [diceCount, setDiceCount] = useState(0);
    const [plinkoCount, setPlinkoCount] = useState(0);
    const { showLoading, hideLoading } = useContext(LoadingContext);

    useEffect(() => {
        if (userAuth.isAuth) {
            initFunc();
        }
        // eslint-disable-next-line
    }, [userAuth]);

    const initFunc = async () => {
        showLoading();
        const userId = userAuth.userData._id;
        const response = await loadDashBoardData({ id: userId });
        if (response.status) {
            setPlayerCount(response.user_count);
            setTurtleCount(response.turtleCount);
            setScissorCount(response.scissorsCount);
            setMinesCount(response.minesCount);
            setWalletCount(response.walletCount);
            setDiceCount(response.diceCount);
            setPlinkoCount(response.plinkoCount);
        }
        hideLoading();
    }

    return (
        <Grid container spacing={1}>
            <PlayerCard count={playerCount} />
            <WalletCard count={walletCount} />
            <TurtleCard count={turtleCount} />
            <ScissorCard count={scissorCount} />
            <MinesCard count={minesCount} />
            <DiceCard count={diceCount} />
            <PlinkoCard count={plinkoCount} />
        </Grid>
    );
};

export default Dashboard;