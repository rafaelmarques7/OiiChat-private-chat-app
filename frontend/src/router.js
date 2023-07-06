import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageHome } from "./pages/Home";
import { PageNewChat } from "./pages/NewChat";
import { PageChatRoom } from "./pages/ChatRoom";

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
