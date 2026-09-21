import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Trips from "./pages/Trips"
import CreateTrip from "./pages/CreateTrip"
import TripDetails from "./pages/TripDetails"
import EditTrip from "./pages/EditTrip"
import NotFound from "./pages/NotFound"

import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Route>

        <Route
          path="/"
          element={<Home />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/trips"
              element={<Trips />}
            />

            <Route
              path="/trips/new"
              element={<CreateTrip />}
            />

            <Route
              path="/trips/:id/edit"
              element={<EditTrip />}
            />

            <Route
              path="/trips/:id"
              element={<TripDetails />}
            />

          </Route>
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
