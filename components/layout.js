import React, { useState, useEffect } from "react";
import Sidebar from "react-sidebar";
import SideMenu from "./sideMenu";
import withAuth from "../utils/auth";

function Layout(props) {
  const [sidebarDocked, setSidebarDocked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: 800px)`);
    const mediaQueryChanged = () => {
      setSidebarDocked(mql.matches);
      setSidebarOpen(false);
    };
    mql.addListener(mediaQueryChanged);
    setSidebarDocked(mql.matches);

    return () => {
      mql.removeListener(mediaQueryChanged);
    };
  }, []);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  return (
    <Sidebar
      sidebar={<SideMenu />}
      open={sidebarOpen}
      docked={sidebarDocked}
      onSetOpen={onSetSidebarOpen}
      styles={{ sidebar: { background: "#075985" } }} //Tailwind sky-800
      transitions={false}
      suppressHydrationWarning={true}
    >
      <div>{props.children}</div>
    </Sidebar>
  );
}

export default withAuth(Layout);
