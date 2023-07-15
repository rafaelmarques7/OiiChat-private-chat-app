export const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

export const URL_MESSAGES = `${URL_BACKEND}/messages`;
export const URL_MESSAGES_ROOM = `${URL_BACKEND}/messages/rooms`;
export const URL_NEW_ROOM = `${URL_BACKEND}/rooms/create-room`;
export const URL_GET_PUBLIC_ROOMS = `${URL_BACKEND}/rooms/public-rooms`;
export const URL_GET_PRIVATE_ROOMS = `${URL_BACKEND}/rooms/private-rooms`;
export const URL_USER_SIGN_UP = `${URL_BACKEND}/users/sign-up`;
export const URL_USER_SIGN_IN = `${URL_BACKEND}/users/sign-in`;
export const URL_USER_SIGN_OUT = `${URL_BACKEND}/users/sign-out`;
export const URL_USER_SALT = `${URL_BACKEND}/users/salt`;

export const QUERY_SIZE = 10;
