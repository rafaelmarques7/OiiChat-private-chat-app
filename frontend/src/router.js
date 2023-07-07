import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageNewChat } from "./pages/NewChat";
import { PageChatRoom } from "./pages/ChatRoom";
import { PageHome } from "./pages/HomePage";

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
    path: "/rooms/:roomId",
    element: <PageChatRoom />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
