import { jsonParseSafe } from "./utils";

/** Function used to save the rooms password in the browsers local storage */
export const saveRoomPasswordToLS = (idRoom, password) => {
  console.log("inside saveRoomPasswordToLS", { idRoom, password });
  localStorage.setItem(idRoom, JSON.stringify({ idRoom, password }));
};

/** Function used to get the rooms password from the browsers local storage */
export const getRoomPasswordFromLS = (idRoom) => {
  const dataStr = localStorage.getItem(idRoom);
  const data = jsonParseSafe(dataStr);
  console.log("getRoomPasswordFromLS", { dataStr, data, idRoom });
  return data?.password || "";
};

export const getUserFromLS = () => {
  const dataStr = localStorage.getItem("ChatAppUserData");
  return jsonParseSafe(dataStr);
};
