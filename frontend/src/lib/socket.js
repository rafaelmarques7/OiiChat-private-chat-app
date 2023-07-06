import { io } from "socket.io-client";
import { URL_BACKEND } from "../config";

// "undefined" means the URL will be computed from the `window.location` object
const URL = URL_BACKEND;

export const socket = io(URL);
