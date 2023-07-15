import SimpleCrypto from "simple-crypto-js";
import {
  URL_BACKEND,
  URL_GET_PRIVATE_ROOMS,
  URL_GET_PUBLIC_ROOMS,
  URL_MESSAGES_ROOM,
  URL_NEW_ROOM,
} from "../config";
import { loadUserDetails } from "./utils";

export const safeGetReq = async (url) => {
  try {
    console.log("GET: ", url);

    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();

      console.log("success,", { url, data });
      return { res: data };
    }
  } catch (e) {
    console.error("error: ", { url, e });
    return { err: e };
  }
};

export const safeGetWithPagination = async (baseUrl, page, query_size) => {
  const reqUrl = `${baseUrl}?page=${page}&limit=${query_size}`;

  const { res, err } = await safeGetReq(reqUrl);
  const hasMoreToLoad = res?.length === query_size;
  return { res, err, hasMoreToLoad };
};

export const safePostPutReq = async (url, method, payload) => {
  try {
    console.log(`making ${method} request: `, { url, payload });

    const res = await fetch(url, {
      method,
      body: JSON.stringify(payload),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return { res: data, err: null };
  } catch (e) {
    console.error(e);
    return { data: null, err: e };
  }
};

export const getRoom = async (roomId) => {
  const url = `${URL_BACKEND}/rooms/${roomId}`;
  return await safeGetReq(url);
};

export const getMessagesByRoom = async (roomId) => {
  const url = `${URL_MESSAGES_ROOM}/${roomId}`;
  return await safeGetReq(url);
};

export const getPublicRooms = async (roomId) => {
  const url = URL_GET_PUBLIC_ROOMS;
  return await safeGetReq(url);
};

export const getUserInfoFromBe = async (idUser) => {
  const url = `${URL_BACKEND}/users/${idUser}`;
  return await safeGetReq(url);
};

export const getPrivateRooms = async (idUser) => {
  const url = `${URL_GET_PRIVATE_ROOMS}/${idUser}`;
  return await safeGetReq(url);
};

export const createNewRoom = async (payload) => {
  try {
    console.log("trying to create a new room: ", URL_NEW_ROOM, payload);
    const res = await fetch(URL_NEW_ROOM, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return { data, err: null };
  } catch (e) {
    console.error(e);
    return { data: null, err: e };
  }
};

export const addPasswordToVault = async (idRoom, userPass, roomPass) => {
  console.log("adding to vault using: ", { idRoom, userPass, roomPass });
  const { userData } = loadUserDetails();
  const cc = new SimpleCrypto(userPass);
  const encryptedPassword = cc.encrypt(roomPass);

  const idUser = userData._id;

  const url = `${URL_BACKEND}/users/${idUser}/add-to-vault`;
  const { res, err } = await safePostPutReq(url, "POST", {
    idUser,
    idRoom,
    passwordRoom: encryptedPassword,
  });
  return { res, err };
};
