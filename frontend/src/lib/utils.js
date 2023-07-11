import { URL_BACKEND, URL_NEW_ROOM } from "../config";

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

export const decryptEvents = (simpleCrypto, events) => {
  return events.map((event) => decryptEvent(simpleCrypto, event));
};

export const decryptEvent = (simpleCrypto, event) => ({
  ...event,
  text: decryptSafe(simpleCrypto, event?.text),
});

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

export const loadUserDetails = () => {
  const userDataStr = localStorage.getItem("ChatAppUserData") || "{}";
  const userData = JSON.parse(userDataStr);
  const isLoggedIn = userData && userData.username;
  return { isLoggedIn, userData };
};
