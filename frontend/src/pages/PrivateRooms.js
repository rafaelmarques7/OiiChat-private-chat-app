import React, { useEffect, useState } from "react";
import { URL_GET_PRIVATE_ROOMS, URL_GET_PUBLIC_ROOMS } from "../config";
import { Navigation } from "../components/navigation";
import { RoomsList } from "../components/rooms/RoomList";

import { loadUserDetails } from "../lib/utils";
export const PagePrivateRooms = () => {
  const [rooms, setRooms] = useState([]);
  const { isLoggedIn, userData } = loadUserDetails();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${URL_GET_PRIVATE_ROOMS}/${userData?._id}`;
        const response = await fetch(url, { mode: "cors" });
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching public rooms:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navigation />
      <RoomsList rooms={rooms} label="My conversations" />
    </>
  );
};
