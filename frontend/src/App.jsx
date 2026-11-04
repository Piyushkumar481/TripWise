import { lazy, Suspense } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

// Public pages
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))

// Main application pages
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Trips = lazy(() => import("./pages/Trips"))
const CreateTrip = lazy(() => import("./pages/CreateTrip"))
const EditTrip = lazy(() => import("./pages/EditTrip"))

// AI itinerary pages
const AIItineraryHistory = lazy(() => import("./pages/AIItineraryHistory"))
const AIItineraryGenerator = lazy(() => import("./pages/AIItineraryGenerator"))
const AIItineraryDetails = lazy(() => import("./pages/AIItineraryDetails"))

// Trip workspace pages
const TripWorkspaceLayout = lazy(() => import("./layouts/TripWorkspaceLayout"))
const TripDetails = lazy(() => import("./pages/TripDetails"))
const TripItinerary = lazy(() => import("./pages/TripItinerary"))
const TripExpenses = lazy(() => import("./pages/TripExpenses"))
const TripDocuments = lazy(() => import("./pages/TripDocuments"))
const TripPacking = lazy(() => import("./pages/TripPacking"))
const TripNotes = lazy(() => import("./pages/TripNotes"))

// Fallback page displayed while a route is loading
const NotFound = lazy(() => import("./pages/NotFound"))

function RouteLoadingFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-[#e1e7e3] bg-white px-6 py-4 text-sm font-medium text-[#71808d] shadow-sm">
        Loading TripWise...
      </div>
    </div>
  )
}

function renderPage(Page) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Page />
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={renderPage(Login)}
          />

          <Route
            path="/register"
            element={renderPage(Register)}
          />
        </Route>

        <Route
          path="/"
          element={renderPage(Home)}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route
              path="/dashboard"
              element={renderPage(Dashboard)}
            />

            <Route
              path="/trips"
              element={renderPage(Trips)}
            />

            <Route
              path="/ai/itinerary/history"
              element={renderPage(AIItineraryHistory)}
            />

            <Route
              path="/ai-itinerary/generate"
              element={renderPage(AIItineraryGenerator)}
            />

            <Route
              path="/ai-itinerary/:id"
              element={renderPage(AIItineraryDetails)}
            />

            <Route
              path="/trips/new"
              element={renderPage(CreateTrip)}
            />

            <Route
              path="/trips/:id/edit"
              element={renderPage(EditTrip)}
            />

            <Route
              path="/trips/:id"
              element={renderPage(TripWorkspaceLayout)}
            >
              <Route
                index
                element={renderPage(TripDetails)}
              />

              <Route
                path="itinerary"
                element={renderPage(TripItinerary)}
              />

              <Route
                path="expenses"
                element={renderPage(TripExpenses)}
              />

              <Route
                path="documents"
                element={renderPage(TripDocuments)}
              />

              <Route
                path="packing"
                element={renderPage(TripPacking)}
              />

              <Route
                path="notes"
                element={renderPage(TripNotes)}
              />
            </Route>

          </Route>
        </Route>

        <Route
          path="*"
          element={renderPage(NotFound)}
        />

      </Routes>
    </BrowserRouter>
  )
}

import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

export default App