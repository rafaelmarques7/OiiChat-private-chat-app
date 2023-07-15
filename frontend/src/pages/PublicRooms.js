import React, { useEffect, useState } from "react";
import { RoomsList } from "../components/rooms/RoomList";
import Layout from "../components/Layout";
import { getPublicRooms, safeGetWithPagination } from "../lib/backend";
import { ButtonAction } from "../components/ButtonLink";
import { URL_GET_PUBLIC_ROOMS } from "../config";

export const PagePublicRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = URL_GET_PUBLIC_ROOMS;
      const { res, err, hasMoreToLoad } = await safeGetWithPagination(
        url,
        page,
        2
      );
      if (res) {
        res && setRooms([...rooms, ...res]);
        setHasMoreToLoad(hasMoreToLoad);
      }
      if (err) {
        setError(err);
        setTimeout(() => setError(null), 4000);
      }
    };

    fetchData();
  }, [page]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <Layout>
      {error && <div className="error">{error}</div>}
      <RoomsList rooms={rooms} label="Public Rooms" />
      <div className="container-button-load-more">
        <button
          onClick={handleLoadMore}
          disabled={!hasMoreToLoad}
          className="button-load-more"
        >
          {hasMoreToLoad ? "Load More" : "Nothing more to load"}
        </button>
      </div>
    </Layout>
  );
};
