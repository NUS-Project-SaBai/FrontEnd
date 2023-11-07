import Link from "next/link";

const SideMenu = (props) => (
  <aside className="menu sideMenu">
    <div className="level sideMenuTop">
      <div className="level-left">
        <figure className="image is-64x64 level-item">
          <img src="/sabaiLogo.png" />
        </figure>

        <h1 className="level-item sideMenuTitle">Sa'Bai '23</h1>
      </div>
    </div>
    <p className="menu-label sideMenuItem">Services</p>
    <ul className="menu-list">
      <li>
        <Link href="/patients" replace>
          Registration
        </Link>
      </li>
      <li>
        <Link href="/queue" replace>
          Queue
        </Link>
      </li>
      <li>
        <Link href="/records" replace>
          Records
        </Link>
      </li>
    </ul>
    <p className="menu-label sideMenuItem">Pharmacy</p>
    <ul className="menu-list">
      <li>
        <Link href="/pharmacy/orders" replace>
          Orders
        </Link>
      </li>
      <li>
        <Link href="/pharmacy/stock" replace>
          Stock
        </Link>
      </li>
    </ul>
    <p className="menu-label sideMenuItem">Others</p>
    <ul className="menu-list">
      {/* uncomment to show users tab */}
      {/* <li>
        <Link href="/users" replace>
          Users
        </Link>
      </li> */}
      <li>
        <a href="/api/auth/logout">Logout</a>
      </li>
    </ul>
  </aside>
);

export default SideMenu;
