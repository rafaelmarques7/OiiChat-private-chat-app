import SimpleCrypto from "simple-crypto-js";
import { URL_BACKEND } from "../config";
import { getUserInfoFromBe } from "./backend";
import { getRoomPasswordFromLS, getUserFromLS } from "./localstorage";

export const jsonParseSafe = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
};

/**
 * Method that returns the decrypted value, or the encrypted value if the decryption fails.
 */
export const decryptSafe = (simpleCrypto, value) => {
  try {
    return simpleCrypto.decrypt(value);
  } catch (e) {
    return value;
  }
};

export const encrypt = (password, valueToEncrypt) => {
  const simpleCrypto = new SimpleCrypto(password);
  return simpleCrypto.encrypt(valueToEncrypt);
};

export const decryptEvents = (simpleCrypto, events) => {
  return events.map((event) => decryptEvent(simpleCrypto, event));
};

export const decryptEvent = (simpleCrypto, event) => ({
  ...event,
  text: decryptSafe(simpleCrypto, event?.text),
});

export const updateRoomInfo = async (roomId, { roomName, visibility }) => {
  try {
    const url = `${URL_BACKEND}/rooms/${roomId}`;
    const payload = { roomName, visibility };

    console.log("making PUT request to update room info: ", { url, payload });

    const res = await fetch(url, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      return null;
    }

    const data = await res.json();
    return { res: data };
  } catch (e) {
    console.error(e);
    return { err: e };
  }
};

export const sha256Hash = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedString = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashedString;
};

// @todo: deprecate this function
export const loadUserDetails = () => {
  const userDataStr = localStorage.getItem("ChatAppUserData") || "{}";
  let userData;
  try {
    userData = JSON.parse(userDataStr);
  } catch (e) {
    userData = {};
  }
  const isLoggedIn = userData && userData.username;
  return { isLoggedIn, userData };
};

/**
 * This function gets the user data from the backend.
 * It checks the local storage first, to get the user ID,
 * and then uses that to make a get request to the backend.
 */
export const loadUserData = async () => {
  const dataLs = getUserFromLS();

  const idUser = dataLs?._id;
  if (!idUser) {
    return { res: null, err: "no user id in local storage" };
  }

  const { res, err } = await getUserInfoFromBe(idUser);
  return { res, err };
};
/**
 * This function:
 * - checks if the password exists in local storage
 *   - if it does, it returns it
 * - if it doesn't, it gets it from the vault
 * - if it doesn't exist in the vault, it returns null
 */
export const loadRoomPassword = (idRoom, userData) => {
  console.log("loadRoomPassword", { idRoom, userData });
  const passwordLs = getRoomPasswordFromLS(idRoom);
  console.log("passwordLs", passwordLs);
  if (passwordLs) {
    return { password: passwordLs, isEncrypted: false };
  }

  // get from vault
  const matches = userData?.vault.filter((item) => item?.idRoom === idRoom);
  const vaultItem = matches?.[0];
  if (vaultItem) {
    return { password: vaultItem?.passwordRoom, isEncrypted: true };
  }

  return { password: null, isEncrypted: false };
};

export const isCorrectPassword = async (userData, password) => {
  const encryptedPassword = await sha256Hash(password);
  const isCorrect = userData.password === encryptedPassword;

  console.log("isCorrectPassword", {
    userData,
    password,
    encryptedPassword,
    isCorrect,
  });
  return isCorrect;
};

export const isCorrectRoomPassword = (roomPassword, roomInfo) => {
  const cc = new SimpleCrypto(roomPassword);

  const valueDecrypted = decryptSafe(cc, roomInfo?.encryptedTestMessage);
  const isCorrect = valueDecrypted === roomInfo?.testMessage;

  return isCorrect;
};
