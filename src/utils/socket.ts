import { io } from "socket.io-client";

// replace with your backend URL
export const socket = io("https://suretrustg29fsd-mahek.onrender.com", {
  transports: ["polling", "websocket"],
  autoConnect: true,
});
