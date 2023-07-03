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
