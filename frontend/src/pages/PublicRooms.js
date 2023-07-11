import React, { useEffect, useState } from "react";
import { RoomsList } from "../components/rooms/RoomList";
import Layout from "../components/Layout";
import { getPublicRooms } from "../lib/backend";

export const PagePublicRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { res } = await getPublicRooms();
      if (res) {
        setRooms(res);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <RoomsList rooms={rooms} label="Public Rooms" />
    </Layout>
  );
};
