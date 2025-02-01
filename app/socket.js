import SocketIOClient from "socket.io-client";
const socket = SocketIOClient.connect("https://ets-backend-t2yw.onrender.com/");
export default socket;
