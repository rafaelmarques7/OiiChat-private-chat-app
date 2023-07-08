import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageChatRoom } from "./pages/ChatRoom";
import { PageHome } from "./pages/HomePage";
import { PagePublicRooms } from "./pages/PublicRooms";

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
    path: "/rooms/public-rooms",
    element: <PagePublicRooms />,
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);
