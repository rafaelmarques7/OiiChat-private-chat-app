import React, { useEffect, useState } from "react";
import { URL_GET_PUBLIC_ROOMS } from "../config";
import { RoomsList } from "../components/rooms/RoomList";
import Layout from "../components/Layout";

export const PagePublicRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL_GET_PUBLIC_ROOMS, { mode: "cors" });
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching public rooms:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <RoomsList rooms={rooms} />
    </Layout>
  );
};
