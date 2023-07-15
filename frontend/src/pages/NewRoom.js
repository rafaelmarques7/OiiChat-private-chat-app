import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../components/FormInput";
import {
  encrypt,
  isCorrectUserPassword,
  loadUserDetails,
  sha256Hash,
} from "../lib/utils";
import { Select } from "@chakra-ui/react";
import { ButtonAction } from "../components/ButtonLink";
import Layout from "../components/Layout";
import { addPasswordToVault, createNewRoom } from "../lib/backend";
import { AddToVault } from "../components/vault/addToVault";
import { saveRoomPasswordToLS } from "../lib/localstorage";
import { v4 as uuidv4 } from "uuid";

export const NewRoom = () => {
  const navigate = useNavigate();

  const { userData } = loadUserDetails();

  const [roomName, setRoomName] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [roomPassword, setRoomPassword] = useState("");
  const [shouldAddToVault, setAddToVault] = useState(true);
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    const isCorrect = await isCorrectUserPassword(
      userData,
      userPassword,
      userData?.salt
    );
    if (visibility === "private" && shouldAddToVault && userData?._id) {
      if (!isCorrect) {
        setError("Incorrect user password");
        setTimeout(() => setError(null), 5000);
        return;
      }
    }

    const value = encrypt(roomPassword, "test-message");
    console.log("creating new room using ", {
      encryptedMessage: value,
      roomPassword,
    });

    const testMessage = uuidv4();
    const encryptedTestMessage = encrypt(roomPassword, testMessage);

    const { data, err } = await createNewRoom({
      roomName,
      visibility,
      ownerId: userData?._id,
      testMessage,
      encryptedTestMessage,
    });

    if (err) {
      setError(err);
      setTimeout(() => setError(null, 5000));
      return;
    }

    if (shouldAddToVault && isCorrect) {
      const op = await addPasswordToVault(data._id, userPassword, roomPassword);
      if (op.err) {
        setError("Error adding to vault");
        setTimeout(() => setError(null, 5000));
        return;
      }
    }

    if (data) {
      saveRoomPasswordToLS(data._id, roomPassword);
      navigate(`/rooms/${data._id}`);
    }
  };

  console.log("new room, ", {
    userData,
    roomName,
    visibility,
    shouldAddToVault,
    password: userPassword,
    roomPassword,
  });

  return (
    <Layout>
      <div className="new-chatroom-container">
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
            initialValue={roomPassword}
            icon={"/img/lock.svg"}
            placeholder="Room roomPassword"
            callback={(val) => setRoomPassword(val)}
            tooltipText="Password used to encrypt messages"
          />
        )}

        <AddToVault
          shouldRender={
            userData?._id &&
            roomName &&
            visibility === "private" &&
            roomPassword
          }
          addToVault={shouldAddToVault}
          setAddToVault={setAddToVault}
          password={userPassword}
          setPassword={setUserPassword}
        />

        {roomName && (visibility === "public" || roomPassword) && (
          <div className="new-room-action-container">
            <ButtonAction label="Create Room!" callback={() => onSubmit()} />
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </Layout>
  );
};
