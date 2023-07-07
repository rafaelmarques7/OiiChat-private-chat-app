import { io } from "socket.io-client";
import { URL_BACKEND } from "../config";

export const socket = io(URL_BACKEND);
