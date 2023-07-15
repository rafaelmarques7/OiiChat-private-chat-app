import { useEffect, useState } from "react";
import { safeGetWithPagination } from "../lib/backend";
import Layout from "../components/Layout";

export const WrapperPagination = ({ url, render }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySize = 3;
      const { res, err, hasMoreToLoad } = await safeGetWithPagination(
        url,
        page,
        querySize
      );
      if (res) {
        res && setData((prevData) => [...prevData, ...res]);
        setHasMoreToLoad(hasMoreToLoad);
      }
      if (err) {
        setError(err);
        setTimeout(() => setError(null), 4000);
      }
    };

    fetchData();
  }, [page, url]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <Layout>
      {error && <div className="error">{error}</div>}
      {render(data)}
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
