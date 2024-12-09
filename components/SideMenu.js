import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  IdentificationIcon,
  PencilIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { OFFLINE } from '@/utils/constants';
import VenueOptionsDropdown from '@/components/VenueOptionsDropdown';
import { VillageContext } from '@/context/VillageContext';

// const SHORTENED_PROD_URL = process.env.NEXT_PUBLIC_SHORTENED_PROD_URL;
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
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SideMenuVillageDropdown() {
  const { village, setVillage } = useContext(VillageContext);
  return (
    <VenueOptionsDropdown
      value={village}
      key={'sideMenu'}
      smaller
      handleInputChange={e => setVillage(e.target.value)}
      showAllOption
    />
  );
}

export default function SideMenu() {
  const router = useRouter();
  const [navItems, setNavItems] = useState(navigation);
  const { user, isLoading } = useUser();

  const handleLogout = async () => {
    if (OFFLINE) {
      window.localStorage.removeItem('offline_user');
      router.push('/').then(() => {
        window.location.reload();
      });
      return;
    } else {
      router.push('/api/auth/logout');
    }
  };

  useEffect(() => {
    const updatedNavItems = navItems.map(item => ({
      ...item,
      current: router.pathname === item.href,
    }));
    setNavItems(updatedNavItems);
  }, [router.pathname]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-y-5 px-6 h-full">
      <div className="flex h-16 shrink-0 items-center">
        <img className="h-8 w-auto" src="/sabaiLogo.png" alt="Sa'Bai Logo" />
        <h1 className="text-white text-2xl ml-2">Sa&apos;Bai &apos;24</h1>
      </div>
      <nav className="h-full">
        <ul role="list" className="flex flex-1 flex-col h-full gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navItems.map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={item.onClick}
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
              Current Village
            </div>
            <SideMenuVillageDropdown />
          </li>
          <div className="flex" />
          <li className="-mx-6 mt-auto">
            <a
              href={'https://dub.sh/sabai'}
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 w-full"
            >
              <ArrowPathIcon className="h-7 w-7" />
              <span aria-hidden="true">Go to newest site</span>
            </a>
            <button
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 w-full"
              onClick={handleLogout}
            >
              <ArrowLeftStartOnRectangleIcon className="h-7 w-7" />
              <span aria-hidden="true">Logout</span>
            </button>
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
