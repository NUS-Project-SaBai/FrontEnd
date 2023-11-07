import Link from "next/link";

const Header = (props) => (
  <nav className="navbar is-dark">
    <div className="navbar-brand">
      <div>
        <h1>Project Sa'bai</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/login" legacyBehavior>
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/profile" legacyBehavior>
              <a>Profile</a>
            </Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>

    {/* <style jsx>{`
      ul {
        display: flex;
        list-style: none;
        margin-left: 0;
        padding-left: 0;
      }

      li {
        margin-right: 1rem;
      }

      li:first-child {
        margin-left: auto;
      }

      a {
        color: #fff;
        text-decoration: none;
      }

      header {
        padding: 0.2rem;
        color: #fff;
        background-color: #333;
      }

      div {
        display: flex;
        
      }
    `}</style> */}
    {/* // </header> */}
  </nav>
);

export default Header;
