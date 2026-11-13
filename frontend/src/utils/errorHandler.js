export const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong."
) => {
  if (!error) {
    return fallbackMessage
  }

  const status = error.response?.status
  const responseData = error.response?.data

  // Handle network timeouts.
  if (
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT"
  ) {
    return "The request timed out. Please try again."
  }

  // Handle requests that never received a response.
  if (!error.response) {
    if (error.request) {
      return "Unable to connect to the server. Please check your connection."
    }

    return fallbackMessage
  }

  // Prefer meaningful messages returned by the backend.
  const serverMessage =
    typeof responseData?.message === "string"
      ? responseData.message.trim()
      : ""

  if (serverMessage) {
    return serverMessage
  }

  switch (status) {
    case 400:
      return "Invalid request. Please check your information."

    case 401:
      return "Your session has expired. Please log in again."

    case 403:
      return "You do not have permission to perform this action."

    case 404:
      return "The requested resource was not found."

    case 409:
      return "This request conflicts with existing information."

    case 429:
      return "Too many requests. Please try again later."

    case 503:
      return "The service is temporarily unavailable. Please try again later."

    default:
      if (status >= 500) {
        return "The server encountered an error. Please try again later."
      }

      return fallbackMessage
  }
}