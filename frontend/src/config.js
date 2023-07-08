const USE_CONFIG = process.env.REACT_APP_USE_CONFIG || "prod";
console.log("frontend using config: ", USE_CONFIG);

export const URL_BACKEND =
  USE_CONFIG === "dev"
    ? "http://localhost:5001"
    : "http://chata-farga-1tcapa2a4psyy-692226949.eu-west-1.elb.amazonaws.com";

export const URL_MESSAGES = `${URL_BACKEND}/messages`;
export const URL_MESSAGES_ROOM = `${URL_BACKEND}/messages/rooms`;
export const URL_NEW_ROOM = `${URL_BACKEND}/rooms/create-room`;
