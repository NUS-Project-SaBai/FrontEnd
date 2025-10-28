'use client';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { useUser } from '@auth0/nextjs-auth0';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  PencilIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

type HeroIconType = React.ComponentType<React.ComponentProps<'svg'>>;
type NavItemData = {
  name: string;
  href: string;
  icon: HeroIconType;
};
const navItems: NavItemData[] = [
  {
    name: 'Patients',
    href: '/records',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Pharmacy Orders',
    href: '/pharmacy/orders',
    icon: PencilIcon,
  },
  {
    name: 'Pharmacy Stock',
    href: '/pharmacy/stock',
    icon: BeakerIcon,
  },
  {
    name: 'Vision',
    href: '/vision',
    icon: EyeIcon,
  },
  {
    name: 'Referrals',
    href: '/referrals',
    icon: ArrowTrendingUpIcon,
  },
];

export function SideMenu() {
  const { user } = useUser();
  const userRole: 'admin' | 'member' | undefined = user?.user_metadata?.role;
  const { village, setVillage } = useContext(VillageContext);
  return (
    <div className="flex h-full min-w-[205px] flex-col bg-gray-900 text-gray-400">
      <div className="flex items-center p-4">
        <Image alt="Sa'bai Logo" src="/sabaiLogo.png" width={32} height={32} />
        <h1 className="ml-2 text-2xl text-gray-500">Sa&apos;Bai</h1>
      </div>

      <nav className="py-4">
        <div className="flex flex-col space-y-1">
          {navItems.map(navItem => (
            <NavItem key={navItem.href} navItem={navItem} />
          ))}
        </div>
      </nav>
      <div className="p-2">
        <VillageOptionDropdown
          village={village}
          handleVillageChange={setVillage}
        />
      </div>

      <div className="h-full" />

      <div className="mt-auto">
        {userRole === 'admin' && (
          <NavItem
            navItem={{
              href: '/account-management',
              name: 'Account Management',
              icon: UserCircleIcon,
            }}
          />
        )}
        <NavItem
          navItem={{
            href: '/auth/logout',
            name: 'Logout',
            icon: ArrowLeftStartOnRectangleIcon,
          }}
        />
        <div className="flex space-x-2 p-4">
          <UserCircleIcon className="h-6 w-6" />
          <p>{user?.nickname}</p>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  navItem: { name, icon: Icon, href },
}: {
  navItem: NavItemData;
}) {
  const isCurrentUrl = usePathname() == href;
  return (
    <Link href={href} prefetch={false}>
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
