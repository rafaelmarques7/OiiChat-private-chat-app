import { URL_NEW_ROOM } from "../config";

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

export const createNewRoom = async () => {
  try {
    const res = await fetch(URL_NEW_ROOM, {
      method: "POST",
      mode: "cors",
    });
    const data = await res.json();
    const roomId = data._id;
    return roomId;
  } catch (e) {
    console.error(e);
    return;
  }
};
