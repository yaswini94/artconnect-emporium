import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import SinglePhoto from "./pages/SinglePhoto";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookmarksList from "./pages/BookmarksList";
import "./App.css";

const App = () => {
  return (
    <div className="page-body">
      <NavBar />
      <div className="page-container" style={{ minHeight: "100vh" }}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/photos">
              <Route path=":photoId" element={<SinglePhoto />} />
              <Route path="" element={<Home />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<BookmarksList />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
