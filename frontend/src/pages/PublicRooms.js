import React from "react";
import { RoomsList } from "../components/rooms/RoomList";
import { URL_GET_PUBLIC_ROOMS } from "../config";
import { WrapperPagination } from "./WrapperPagination";

export const PagePublicRooms = () => {
  return (
    <WrapperPagination
      url={URL_GET_PUBLIC_ROOMS}
      render={(data) => <RoomsList rooms={data} label="Public Rooms" />}
    />
  );
};
