import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageChatRoom } from "./pages/ChatRoom";
import { PageHome } from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageHome />,
  },
  {
    path: "/rooms/:roomId",
    element: <PageChatRoom />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
