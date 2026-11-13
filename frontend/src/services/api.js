import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl?.trim()) {
  throw new Error("VITE_API_BASE_URL is required.")
}

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tripwise_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const AUTH_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
]

const isAuthenticationRequest = (url = "") => {
  const requestPath = url.split("?")[0].replace(/\/+$/, "")

  return AUTH_ENDPOINTS.some((endpoint) =>
    requestPath.endsWith(endpoint)
  )
}

let isRedirectingAfterUnauthorized = false

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const hasStoredToken = Boolean(
      localStorage.getItem("tripwise_token")
    )

    const isAuthRequest = isAuthenticationRequest(
      error.config?.url
    )

    if (
      status === 401 &&
      hasStoredToken &&
      !isAuthRequest &&
      !isRedirectingAfterUnauthorized
    ) {
      isRedirectingAfterUnauthorized = true

      localStorage.removeItem("tripwise_token")
      localStorage.removeItem("tripwise_user")

      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api
