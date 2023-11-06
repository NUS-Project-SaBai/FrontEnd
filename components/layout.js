import React, { useState, useEffect } from "react";
import Sidebar from "react-sidebar";
import SideMenu from "./sideMenu";
import withAuth from "../utils/auth"

function Layout(props) {
  const [mql, setMql] = useState(null);
  const [sidebarDocked, setSidebarDocked] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(mediaQueryChanged);
    setMql(mql);
    setSidebarDocked(mql.matches);

    return () => {
      mql.removeListener(mediaQueryChanged);
    };
  }, []);

  const mediaQueryChanged = () => {
    setSidebarDocked(mql.matches);
    setSidebarOpen(false);
  };

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  return (
    <Sidebar
      sidebar={<SideMenu />}
      open={sidebarOpen}
      docked={sidebarDocked}
      onSetOpen={onSetSidebarOpen}
      styles={{ sidebar: { background: "#180424" } }}
      transitions={false}
      suppressHydrationWarning={true}
    >
      <div>{props.children}</div>
    </Sidebar>
  );
}

export default withAuth(Layout);
