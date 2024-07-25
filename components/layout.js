import React, { useState, useEffect } from 'react';
import Sidebar from 'react-sidebar';
import SideMenu from './sideMenu';
import withAuth from '../utils/auth';

function Layout(props) {
  const [sidebarDocked, setSidebarDocked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 800px)');
    console.log(mql.matches);
    const mediaQueryChanged = () => {
      setSidebarDocked(mql.matches);
      setSidebarOpen(false);
    };
    mql.addEventListener('change', mediaQueryChanged);
    setSidebarDocked(mql.matches);

    return () => {
      mql.removeEventListener('change', mediaQueryChanged);
    };
  }, []);

  const onSetSidebarOpen = open => {
    setSidebarOpen(open);
  };

  return (
    <Sidebar
      sidebar={<SideMenu />}
      open={sidebarOpen}
      docked={sidebarDocked}
      onSetOpen={onSetSidebarOpen}
      transitions={false}
      suppressHydrationWarning={true}
    >
      <div className="relative">
        {!sidebarOpen && (
          <>
            <div
              className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-16 bg-gray-700 rounded-r-md cursor-pointer z-10 lg:hidden"
              onClick={() => onSetSidebarOpen(true)}
            ></div>
          </>
        )}
        {props.children}
      </div>
    </Sidebar>
  );
}

export default withAuth(Layout);
