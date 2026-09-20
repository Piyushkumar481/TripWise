import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PublicRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/trips" replace />
  }

  return <Outlet />
}

export default PublicRoute
