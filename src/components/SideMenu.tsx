'use client';

import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VILLAGES_AND_ALL } from '@/constants';
import { VillageContext } from '@/context/VillageContext';
import { getUserByEmail } from '@/data/user';
import { useUser } from '@auth0/nextjs-auth0';

import {
  ArrowLeftStartOnRectangleIcon,
  ArrowTrendingUpIcon,
  Bars3Icon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  PencilIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

type HeroIconType = React.ComponentType<React.ComponentProps<'svg'>>;
type NavItemData = {
  name: string;
  href: string;
  icon: HeroIconType;
};
const navItems: NavItemData[] = [
  { name: 'Patients', href: '/records', icon: ClipboardDocumentListIcon },
  { name: 'Pharmacy Orders', href: '/pharmacy/orders', icon: PencilIcon },
  { name: 'Pharmacy Stock', href: '/pharmacy/stock', icon: BeakerIcon },
  { name: 'Vision', href: '/vision', icon: EyeIcon },
  { name: 'Referrals', href: '/referrals', icon: ArrowTrendingUpIcon },
];

export function SideMenu() {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string>('member');
  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email).then(user => {
        setUserRole(user?.[0].role || 'member');
      });
    }
  }, [user?.email]);
  const { village, setVillage } = useContext(VillageContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex-col bg-gray-900 text-gray-400 md:flex md:h-full md:w-52">
        <div className="flex">
          <div className="flex items-center px-4 py-2">
            <Image
              alt="Sa'bai Logo"
              src="/sabaiLogo.png"
              width={32}
              height={32}
            />
            <h1 className="ml-2 text-2xl text-gray-500">Sa&apos;Bai</h1>
          </div>
          <p className="h-fit self-center rounded-lg opacity-90 md:hidden">
            Village:&nbsp;
            <span
              className={VILLAGES_AND_ALL[village].color + ' font-semibold'}
            >
              {village}
            </span>
          </p>
          <button
            className="ml-auto rounded p-4 text-gray-400 hover:bg-gray-700 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close nav menu' : 'Open nav menu'}
          >
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
        <aside
          className={
            (open ? 'scale-y-100' : 'scale-y-0 md:scale-y-100') +
            ' absolute z-10 h-full w-full origin-top justify-between bg-gray-900 transition duration-200 md:static md:z-0 md:flex md:flex-col'
          }
        >
          <div>
            {navItems.map(navItem => (
              <NavItem
                key={navItem.href}
                navItem={navItem}
                onClick={() => setOpen(false)}
              />
            ))}
            <div className="p-2">
              <VillageOptionDropdown
                village={village}
                handleVillageChange={setVillage}
              />
            </div>
          </div>
          <div>
            {userRole === 'admin' && (
              <NavItem
                navItem={{
                  href: '/account-management',
                  name: 'Account Management',
                  icon: UserCircleIcon,
                }}
                onClick={() => setOpen(false)}
              />
            )}
            <NavItem
              navItem={{
                href: '/auth/logout',
                name: 'Logout',
                icon: ArrowLeftStartOnRectangleIcon,
              }}
              onClick={() => setOpen(false)}
            />
            <div className="flex items-center space-x-2 p-4">
              <UserCircleIcon className="h-6 w-6" />
              <div>
                <p>{user?.nickname}</p>
                <p>@{user?.name}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function NavItem({
  navItem: { name, icon: Icon, href },
  onClick,
}: {
  navItem: NavItemData;
  onClick?: () => void;
}) {
  const isCurrentUrl = usePathname() == href;
  return (
    <Link href={href} prefetch={false} onClick={onClick}>
      <div
        className={
          'flex gap-x-2 rounded px-4 py-2 hover:bg-gray-800 hover:text-gray-200 ' +
          (isCurrentUrl && 'bg-gray-800 text-gray-200')
        }
      >
        <Icon className="h-6 w-6" />
        <p>{name}</p>
      </div>
    </Link>
  );
}
