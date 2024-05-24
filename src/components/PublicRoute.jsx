import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Navigate to={"/"} replace /> : <Outlet />;
};

export default PrivateRoute;
