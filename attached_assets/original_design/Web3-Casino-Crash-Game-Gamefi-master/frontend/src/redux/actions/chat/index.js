import { io } from 'socket.io-client';
import Config from "config/index";

const chatRoomConnect = async () => {
    Config.Root.chatSocket = io(Config.Root.chatSocketUrl, { transports: ['websocket'] });
}

export default chatRoomConnect;