const SimpleCrypto = require("simple-crypto-js").default;

// Add your data here
const PASSWORD_ROOM = "";
const ENCRYPTED_MESSAGE = "";

const decryptSafe = (simpleCrypto, value) => {
  try {
    return simpleCrypto.decrypt(value);
  } catch (e) {
    return value;
  }
};

const cryptoClient = new SimpleCrypto(PASSWORD_ROOM);
const valueDecrypted = decryptSafe(cryptoClient, ENCRYPTED_MESSAGE);

console.log("result", { valueDecrypted, encryptionKey: PASSWORD_ROOM });
