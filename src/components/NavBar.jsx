import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NavBar = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await signOut();
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="nav-bar">
      <h1>ArtConnect Emporium</h1>
      <ul>
        {!user && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {!user && (
          <li>
            <Link to="/register">Register</Link>
          </li>
        )}
        {user && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}
        {user && (
          <li>
            <Link to="/profile">profile</Link>
          </li>
        )}
        {user && (
          <li>
            <Link to="/bookmarks">Bookmarks</Link>
          </li>
        )}
        {user && <li onClick={handleLogout}>LogOut</li>}
      </ul>
    </div>
  );
};

export default NavBar;
