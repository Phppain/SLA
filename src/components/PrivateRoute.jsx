import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const user = useSelector((state) => state.auth.user);
  const policyAccepted = useSelector((state) => state.auth.policyAccepted);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!policyAccepted) {
    return null; // пока политика не принята, ничего не показываем (модалка и так блокирует)
  }

  return <Outlet />;
}
