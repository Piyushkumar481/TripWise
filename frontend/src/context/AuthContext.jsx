import {
  useEffect,
  useState,
} from "react"

import { getCurrentUser } from "../services/authService"
import { AuthContext } from "./context"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("tripwise_user")

    return storedUser
      ? JSON.parse(storedUser)
      : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem("tripwise_token")
  })

  const [loading, setLoading] = useState(true)

  const login = (loginData) => {
    const receivedToken = loginData.data.token
    const receivedUser = loginData.data.user

    localStorage.setItem(
      "tripwise_token",
      receivedToken
    )

    localStorage.setItem(
      "tripwise_user",
      JSON.stringify(receivedUser)
    )

    setToken(receivedToken)
    setUser(receivedUser)
  }

  const logout = () => {
    localStorage.removeItem("tripwise_token")
    localStorage.removeItem("tripwise_user")

    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await getCurrentUser()

        const currentUser = response.data

        setUser(currentUser)

        localStorage.setItem(
          "tripwise_user",
          JSON.stringify(currentUser)
        )
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        )

        logout()
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser()
  }, [token])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
