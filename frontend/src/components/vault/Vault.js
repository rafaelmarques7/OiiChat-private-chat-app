import { useNavigate } from "react-router-dom";
import "./Vault.css";
import { useState } from "react";

export const VaultItem = ({ item, navigate }) => (
  <div className="profile-vault-item">
    <div className="profile-room-name">
      <a href={navigate && item ? `/rooms/${item.idRoom}` : ""}>
        {item?.roomName}
      </a>
    </div>
    <div className="profile-room-password">
      <p>{item?.passwordRoom}</p>
    </div>
  </div>
);

export const Vault = ({ vault }) => {
  const navigate = useNavigate();

  return (
    <div className="chatroom-room-content-container">
      <div className="profile-vault-title">My vault</div>
      <div className="profile-vault-header">
        <VaultItem
          item={{ roomName: "Room Name", passwordRoom: "Password" }}
          index={0}
        />
      </div>
      <div className="profile-vault-items">
        {vault &&
          vault.map((item, index) => (
            <VaultItem
              item={item}
              index={index + 1}
              navigate={navigate}
              key={`vault-item-${index}`}
            />
          ))}
      </div>
    </div>
  );
};
