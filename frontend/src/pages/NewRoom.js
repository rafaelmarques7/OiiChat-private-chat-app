import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../components/FormInput";
import { loadUserDetails } from "../lib/utils";
import { Select } from "@chakra-ui/react";
import { ButtonAction } from "../components/ButtonLink";
import Layout from "../components/Layout";
import { addPasswordToVault, createNewRoom } from "../lib/backend";
import { InputToggle } from "../components/InputToggle";
import { FormAddToVault } from "../components/forms/FormAddToVault";
import { AddToVault } from "../components/vault/addToVault";

export const NewRoom = () => {
  const navigate = useNavigate();

  const { userData } = loadUserDetails();

  const [roomName, setRoomName] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [password, setPassword] = useState("");
  const [addToVault, setAddToVault] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    const { data, err } = await createNewRoom({
      roomName,
      visibility,
      ownerId: userData?._id,
    });

    await addPasswordToVault(data._id, password);

    if (err) {
      setError(err);
      setTimeout(() => setError(null), 5000);
    }

    if (data) {
      navigate(`/rooms/${data._id}`);
    }
  };

  console.log("new room, ", { userData, roomName, visibility, addToVault });

  return (
    <Layout>
      <div className="chatroom-room-settings-container">
        <FormInput
          placeholder="Enter room name"
          icon={"/img/group.svg"}
          callback={(val) => setRoomName(val)}
          tooltipText="Change room name"
        />

        {roomName && (
          <div className="form-input-container">
            <img
              src={"/img/visibility.svg"}
              alt=""
              className="form-input-icon"
            />

            <Select
              onChange={(val) => setVisibility(val.target.value)}
              value={visibility}
              size={"md"}
              border={"none"}
              fontSize={14}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Select>
          </div>
        )}

        {roomName && visibility === "private" && (
          <FormInput
            initialValue={password}
            icon={"/img/lock.svg"}
            placeholder="Room password"
            callback={(val) => setPassword(val)}
            tooltipText="Password used to encrypt messages"
          />
        )}

        <AddToVault
          shouldRender={
            userData?._id && roomName && visibility === "private" && password
          }
          addToVault={addToVault}
          setAddToVault={setAddToVault}
        />

        {roomName && (visibility === "public" || password) && (
          <div className="new-room-action-container">
            <ButtonAction label="Create Room!" callback={() => onSubmit()} />
          </div>
        )}

        {error && (
          <div className="error-message">
            There was an error creating the room: {error}
          </div>
        )}
      </div>
    </Layout>
  );
};
