import React, { useEffect, useState } from "react";
import { URL_GET_PRIVATE_ROOMS } from "../config";
import { RoomsList } from "../components/rooms/RoomList";

import { loadUserDetails } from "../lib/utils";
import Layout from "../components/Layout";
export const PagePrivateRooms = () => {
  const [rooms, setRooms] = useState([]);
  const { isLoggedIn, userData } = loadUserDetails();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${URL_GET_PRIVATE_ROOMS}/${userData?._id}`;
        const response = await fetch(url, { mode: "cors" });
        const data = await response.json();
        console.log("response: ", data);
        setRooms(data);
      } catch (error) {
        console.error("Error fetching public rooms:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <RoomsList rooms={rooms} label="My conversations" />
    </Layout>
  );
};
