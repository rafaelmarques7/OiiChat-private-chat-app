import { URL_BACKEND, URL_MESSAGES_ROOM } from "../config";

export const getRoom = async (roomId) => {
  try {
    const url = `${URL_BACKEND}/rooms/${roomId}`;
    console.log("fetching room info from url: ", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();

      console.log("success", data);
      return { res: data };
    }
  } catch (e) {
    console.error("error fetching room info: ", e);
    return { err: e };
  }
};

export const getMessagesByRoom = async (roomId) => {
  try {
    const url = `${URL_MESSAGES_ROOM}/${roomId}`;
    console.log("GET messages for room from url: ", url);

    const res = await fetch(url, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();

      console.log("success", data);
      return { res: data };
    }
  } catch (e) {
    console.error("error fetching room info: ", e);
    return { err: e };
  }
};
