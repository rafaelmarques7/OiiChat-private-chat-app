import { useEffect, useState } from "react";
import { Vault } from "../vault/Vault";
import "./Profile.css";
import {
  decryptSafe,
  isCorrectUserPassword,
  loadUserDetails,
} from "../../lib/utils";
import SimpleCrypto from "simple-crypto-js";

const decryptVault = async (vault, password) => {
  if (!password || !vault) return vault;

  const cc = new SimpleCrypto(password);

  return vault.map((item) => ({
    ...item,
    passwordRoom: decryptSafe(cc, item?.passwordRoom),
  }));
};

export const Profile = ({ userInfo }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vault, setVault] = useState(null);
  const [password, setPassword] = useState("");
  const { userData } = loadUserDetails();

  useEffect(() => {
    const update = async () => {
      const isCorrect = await isCorrectUserPassword(
        userData,
        password,
        userData?.salt
      );
      if (isCorrect) {
        const currVault = vault || userInfo.vault || [];
        const newVault = await decryptVault(currVault, password);

        setIsUnlocked(true);
        setVault(newVault);
      }
    };
    update();
  }, [password]);

  console.log("profile: ", { userInfo, vault, isUnlocked, password });
  return (
    <div className="chatroom-room-content-container">
      <div className="profile-title">{userInfo?.username}</div>

      {!isUnlocked && (
        <div className="container-unlock-vault">
          <p>Unlock vault</p>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}
      <Vault vault={vault || userInfo?.vault} />
    </div>
  );
};
