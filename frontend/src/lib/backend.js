import {
  URL_BACKEND,
  URL_GET_PRIVATE_ROOMS,
  URL_GET_PUBLIC_ROOMS,
  URL_MESSAGES_ROOM,
} from "../config";

export const getReqSafe = async (url) => {
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

export const getRoom = async (roomId) => {
  const url = `${URL_BACKEND}/rooms/${roomId}`;
  return await getReqSafe(url);
};

export const getMessagesByRoom = async (roomId) => {
  const url = `${URL_MESSAGES_ROOM}/${roomId}`;
  return await getReqSafe(url);
};

export const getPublicRooms = async (roomId) => {
  const url = URL_GET_PUBLIC_ROOMS;
  return await getReqSafe(url);
};

export const getPrivateRooms = async (idUser) => {
  const url = `${URL_GET_PRIVATE_ROOMS}/${idUser}`;
  return await getReqSafe(url);
};
