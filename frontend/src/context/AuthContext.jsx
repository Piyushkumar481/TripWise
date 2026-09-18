import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("tripwise_user")

    return storedUser ? JSON.parse(storedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem("tripwise_token")
  })

  const login = (loginData) => {
    const receivedToken = loginData.data.token
    const receivedUser = loginData.data.user

    localStorage.setItem("tripwise_token", receivedToken)
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

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
