import React from "react";
import { Navigation } from "./navigation";

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="chatroom-contents-container">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
