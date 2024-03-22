import Link from "next/link";
import { useRouter } from "next/router";
import RegistrationIcon from "./icons/RegistrationIcon";

const SideMenu = (props) => {
  const router = useRouter();

  const isActive = (href) => {
    return router.pathname.startsWith(href);
  };

  return (
    <aside className="menu sideMenu">
      <div className="level sideMenuTop">
        <div className="level-left">
          <figure className="image is-64x64 level-item">
            <img src="/sabaiLogo.png" alt="Sa'Bai Logo" />
          </figure>
          <h1 className="level-item sideMenuTitle">Sa'Bai '23</h1>
        </div>
      </div>
      <p className="text-white ml-4 text-3xl font-bold my-0">Services</p>
      <ul className="menu-list">
        <li className={isActive("/registration") ? "bg-yellow-500" : ""}>
          <Link href="/registration" className="text-xl" replace>
            Registration
            <RegistrationIcon />
          </Link>
        </li>
        <li
          className={
            isActive("/queue") ||
            isActive("/record") ||
            isActive("/patientMedical") ||
            isActive("/patientVital")
              ? "bg-yellow-500"
              : ""
          }
        >
          <Link href="/queue" className="text-xl" replace>
            Patient records
          </Link>
        </li>
        {/* Add more sidebar options as needed */}
      </ul>
      <p className="text-white ml-4 text-3xl font-bold my-1">Pharmacy</p>
      <ul className="menu-list">
        <li className={isActive("/pharmacy/orders") ? "bg-yellow-500" : ""}>
          <Link href="/pharmacy/orders" className="text-xl" replace>
            Orders
          </Link>
        </li>
        <li className={isActive("/pharmacy/stock") ? "bg-yellow-500" : ""}>
          <Link href="/pharmacy/stock" className="text-xl" replace>
            Stock
          </Link>
        </li>
      </ul>
      <p className="text-white ml-4 text-3xl font-bold my-1">Others</p>
      <ul className="menu-list">
        {/* uncomment to show users tab */}
        {/* <li>
          <Link href="/users" replace>
            <div className={isActive('/users') ? 'active' : ''}>
              <a>Users</a>
            </div>
          </Link>
        </li> */}
        <li>
          <Link href="/api/auth/logout" className="text-xl">
            Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideMenu;
