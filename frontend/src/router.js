import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageHome } from "./pages/Home";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageHome />,
  },
  {
    path: "/new-chat",
    element: <App />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
