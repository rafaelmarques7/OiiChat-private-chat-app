import React from "react";
import { RoomsList } from "../components/rooms/RoomList";
import { loadUserDetails } from "../lib/utils";
import { WrapperPagination } from "./WrapperPagination";
import { URL_GET_PRIVATE_ROOMS } from "../config";

export const PagePrivateRooms = () => {
  const { userData } = loadUserDetails();

  return (
    <WrapperPagination
      url={`${URL_GET_PRIVATE_ROOMS}/${userData?._id}`}
      render={(data) => <RoomsList rooms={data} label="My Conversations" />}
    />
  );
};
