import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Trips from "./pages/Trips"
import NotFound from "./pages/NotFound"

import AppLayout from "./layouts/AppLayout"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public pages */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Application pages */}

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/trips"
          element={
            <AppLayout>
              <Trips />
            </AppLayout>
          }
        />

        {/* 404 */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
