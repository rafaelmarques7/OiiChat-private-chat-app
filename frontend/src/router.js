import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "./pages/NotFound";
import { PageChatRoom } from "./pages/ChatRoom";
import { PageHome } from "./pages/HomePage";
import { PagePublicRooms } from "./pages/PublicRooms";
import { SignUpPage } from "./pages/SignUpPage";
import { SignOutPage } from "./pages/SignOutPage";
import { SignInPage } from "./pages/SignInPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageHome />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-out",
    element: <SignOutPage />,
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
