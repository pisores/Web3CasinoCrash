import { io } from 'socket.io-client';
import Config from "config/index";

const baseInit = async () => {
    Config.Root.socket = io(Config.Root.socketServerUrl, { transports: ['websocket'] });
    console.log("websockect connected");
}

export default baseInit;