import { io } from "socket.io-client";
import { baseUrl } from "../baseUrl";

export const socket = io(
  baseUrl.replace("/api", ""), // remove /api for socket
  {
    transports: ["polling", "websocket"],
    autoConnect: true,
  }
);
