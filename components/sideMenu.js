import Link from "next/link";
import { useRouter } from "next/router";

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
      <p className="menu-label sideMenuItem">Services</p>
      <ul className="menu-list">
        <li className={isActive("/registration") ? "bg-yellow-500" : ""}>
          <Link href="/registration" replace>
            <div>
              <a>Registration</a>
            </div>
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
          <Link href="/queue" replace>
            <div>
              <a>Patient Records</a>
            </div>
          </Link>
        </li>
        {/* Add more sidebar options as needed */}
      </ul>
      <p className="menu-label sideMenuItem">Pharmacy</p>
      <ul className="menu-list">
        <li className={isActive("/pharmacy/orders") ? "bg-yellow-500" : ""}>
          <Link href="/pharmacy/orders" replace>
            <div>
              <a>Orders</a>
            </div>
          </Link>
        </li>
        <li className={isActive("/pharmacy/stock") ? "bg-yellow-500" : ""}>
          <Link href="/pharmacy/stock" replace>
            <div>
              <a>Stock</a>
            </div>
          </Link>
        </li>
      </ul>
      <p className="menu-label sideMenuItem">Others</p>
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
          <Link href="/api/auth/logout">
            <div>
              <a>Logout</a>
            </div>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideMenu;
