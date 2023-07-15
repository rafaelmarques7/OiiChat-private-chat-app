import SimpleCrypto from "simple-crypto-js";
import {
  QUERY_SIZE,
  URL_BACKEND,
  URL_GET_PRIVATE_ROOMS,
  URL_GET_PUBLIC_ROOMS,
  URL_MESSAGES_ROOM,
  URL_NEW_ROOM,
  URL_USER_SALT,
  URL_USER_SIGN_IN,
} from "../config";
import { loadUserDetails, sha256Hash } from "./utils";

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
    return { err: e, res: null };
  }
};

export const safeGetWithPagination = async (
  baseUrl,
  page,
  query_size = QUERY_SIZE
) => {
  const reqUrl = `${baseUrl}?page=${page}&limit=${query_size}`;

  const opGet = await safeGetReq(reqUrl);
  const hasMoreToLoad = opGet?.res?.length === query_size;
  return { res: opGet?.res, err: opGet?.err, hasMoreToLoad };
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

export const getUserSalt = async (username) => {
  const url = `${URL_USER_SALT}?username=${username}`;
  console.log("GET ", url);

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      return { err: new Error("User details not found") };
    }
    if (response.status !== 200) {
      return { err: new Error("Get request failed") };
    }

    const data = await response.json();
    return { res: data?.salt };
  } catch (error) {
    console.log("error: ", { error, url });
    return { err: error };
  }
};

export const checkLoginDetails = async (username, password, salt) => {
  try {
    const passwordSalted = `${password}${salt}`;

    const signInData = {
      username,
      password: await sha256Hash(passwordSalted),
    };
    console.log("sign in data", { salt, signInData, passwordSalted });

    const res = await fetch(URL_USER_SIGN_IN, {
      method: "POST",
      body: JSON.stringify(signInData),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      return { err: "User details do not match" };
    }

    const data = await res.json();
    return { res: data };
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};
