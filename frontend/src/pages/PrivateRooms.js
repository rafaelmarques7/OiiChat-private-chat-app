import React, { useEffect, useState } from "react";
import { RoomsList } from "../components/rooms/RoomList";
import { loadUserDetails } from "../lib/utils";
import Layout from "../components/Layout";
import { getPrivateRooms } from "../lib/backend";

export const PagePrivateRooms = () => {
  const [rooms, setRooms] = useState([]);
  const { userData } = loadUserDetails();

  useEffect(() => {
    const fetchData = async () => {
      const { res } = await getPrivateRooms(userData?._id);
      if (res) {
        setRooms(res);
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
