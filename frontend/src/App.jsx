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
import TripWorkspaceLayout from "./layouts/TripWorkspaceLayout"
import TripItinerary from "./pages/TripItinerary"
import TripExpenses from "./pages/TripExpenses"
import TripDocuments from "./pages/TripDocuments"
import TripPacking from "./pages/TripPacking"
import TripNotes from "./pages/TripNotes"
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

            <Route path="/trips/:id" element={<TripWorkspaceLayout />}>
              <Route
                index
                element={<TripDetails />}
              />

              <Route
                path="itinerary"
                element={<TripItinerary />}
              />

              <Route
                path="expenses"
                element={<TripExpenses />}
              />

              <Route
                path="documents"
                element={<TripDocuments />}
              />

              <Route
                path="packing"
                element={<TripPacking />}
              />

              <Route
                path="notes"
                element={<TripNotes />}
              />
            </Route>

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
