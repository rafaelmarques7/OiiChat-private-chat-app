import { Vault } from "../vault/Vault";
import "./Profile.css";

export const VaultItem = ({ item, index }) => (
  <div className="profile-vault-item" key={`vault-item-${index}`}>
    <div className="profile-room-name">
      <p>{item?.roomName}</p>
    </div>
    <div className="profile-room-password">
      <p>{"pass" || item?.passwordRoom}</p>
    </div>
  </div>
);

export const Profile = ({ userInfo }) => {
  return (
    <div className="chatroom-room-content-container">
      <div className="profile-title">{userInfo?.username}</div>
      <Vault userInfo={userInfo} />
    </div>
  );
};
