import React, { useEffect } from "react";
import { URL_GET_PUBLIC_ROOMS } from "../config";
import { Navigation } from "../components/navigation";

export const PagePublicRooms = () => {
  useEffect(() => {
    console.log("running page load effect.");

    const fetchData = async () => {
      const url = URL_GET_PUBLIC_ROOMS;

      console.log("making GET request: ", url);
      const response = await fetch(url, {
        mode: "cors",
      });
      const data = await response.json();
      console.log("fetch returned", { response, data });
    };

    fetchData();
  }, []);

  console.log("rendering public rooms page: ", {});

  return (
    <div className="chatroom-container">
      <Navigation />

      <p>Public rooms:</p>
    </div>
  );
};
