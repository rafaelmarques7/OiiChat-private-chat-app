import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageHome } from "./pages/Home";
import App from "./App";
import { PageNewChat } from "./pages/NewChat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageHome />,
  },
  {
    path: "/new-chat",
    element: <PageNewChat />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
