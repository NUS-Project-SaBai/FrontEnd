import React, { useState, useEffect } from 'react';
import Sidebar from 'react-sidebar';
import SideMenu from '@/components/SideMenu';
import withAuth from '@/utils/auth';
import { OFFLINE } from '@/utils/constants';

function Layout(props) {
  const [sidebarDocked, setSidebarDocked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displaySideBar, setDisplaySideBar] = useState(true);

  useEffect(() => {
    // 768px is tailwind breakpoint for md
    const mql = window.matchMedia('(min-width: 768px)');
    const mediaQueryChanged = () => {
      setSidebarDocked(mql.matches);
      setSidebarOpen(false);
    };
    mql.addEventListener('change', mediaQueryChanged);
    setSidebarDocked(mql.matches);

    const offlineUserFromStorage = window.localStorage.getItem('offline_user');
    setDisplaySideBar(!OFFLINE || offlineUserFromStorage);

    return () => {
      mql.removeEventListener('change', mediaQueryChanged);
    };
  }, []);

  const onSetSidebarOpen = open => {
    setSidebarOpen(open);
  };

  if (displaySideBar) {
    return (
      <Sidebar
        sidebar={<SideMenu />}
        open={sidebarOpen}
        docked={sidebarDocked}
        onSetOpen={onSetSidebarOpen}
        transitions={false}
        suppressHydrationWarning={true}
        sidebarClassName="bg-gray-900"
      >
        <div>
          {!sidebarOpen && (
            <div
              className="fixed top-1/2 left-0 transform -translate-y-1/2 w-2 h-16 bg-gray-700 rounded-r-md cursor-pointer z-10 md:hidden"
              onClick={() => onSetSidebarOpen(true)}
            ></div>
          )}
          {props.children}
        </div>
      </Sidebar>
    );
  } else {
    return <div>{props.children}</div>;
  }
}

export default withAuth(Layout);
