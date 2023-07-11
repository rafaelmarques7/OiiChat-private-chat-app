import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../components/FormInput";
import { createNewRoom, loadUserDetails } from "../lib/utils";
import { Select } from "@chakra-ui/react";
import { ButtonAction } from "../components/ButtonLink";
import Layout from "../components/Layout";

export const NewRoom = () => {
  const navigate = useNavigate();

  const { userData } = loadUserDetails();
  console.log("user details, ", userData);

  const [roomName, setRoomName] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    const { data, err } = await createNewRoom({
      roomName,
      visibility,
      ownerId: userData?._id,
    });

    if (err) {
      setError(err);
      setTimeout(() => setError(null), 5000);
    }

    if (data) {
      navigate(`/rooms/${data._id}`);
    }
  };

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
            placeholder="Password"
            callback={(val) => setPassword(val)}
            tooltipText="Password used to encrypt messages"
          />
        )}

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
