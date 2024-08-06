import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  IdentificationIcon,
  PencilIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ArrowLeftStartOnRectangleIcon,
  DeviceTabletIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Registration',
    href: '/registration',
    icon: IdentificationIcon,
    count: '5',
    current: true,
  },
  {
    name: 'Patient Records',
    href: '/records',
    icon: ClipboardDocumentListIcon,
    count: '12',
    current: false,
  },
  {
    name: 'Pharmacy Orders',
    href: '/pharmacy/orders',
    icon: PencilIcon,
    count: '20+',
    current: false,
  },
  {
    name: 'Pharmacy Stock',
    href: '/pharmacy/stock',
    icon: BeakerIcon,
    current: false,
  },
  {
    name: 'Debugging',
    href: '/debug',
    icon: DeviceTabletIcon,
    current: false,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog8ToothIcon,
    current: false,
  },
  {
    name: 'Logout',
    href: '/api/auth/logout',
    icon: ArrowLeftStartOnRectangleIcon,
    current: false,
  },
];

const locations = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SideMenu() {
  const router = useRouter();
  const [navItems, setNavItems] = useState(navigation);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const updatedNavItems = navItems.map(item => ({
      ...item,
      current: router.pathname === item.href,
    }));
    setNavItems(updatedNavItems);
  }, [router.pathname]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 h-full">
      <div className="flex h-16 shrink-0 items-center">
        <img className="h-8 w-auto" src="/sabaiLogo.png" alt="Sa'Bai Logo" />
        <h1 className="text-white text-2xl ml-2">Sa&apos;Bai &apos;24</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navItems.map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Locations (Not Functional Yet)
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {locations.map(location => (
                <li key={location.id}>
                  <a
                    href={location.href}
                    className={classNames(
                      locations.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                      {location.initial}
                    </span>
                    <span className="truncate">{location.id}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
            >
              <img
                className="h-8 w-8 rounded-full bg-gray-800"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">{user ? user.name : 'Loading...'}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
