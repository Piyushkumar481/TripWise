export const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong."
) => {
  if (!error) {
    return fallbackMessage
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.error) {
    return error.response.data.error
  }

  if (error.response?.status === 400) {
    return "Invalid request. Please check your information."
  }

  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again."
  }

  if (error.response?.status === 403) {
    return "You do not have permission to perform this action."
  }

  if (error.response?.status === 404) {
    return "The requested resource was not found."
  }

  if (error.response?.status >= 500) {
    return "Server error. Please try again later."
  }

  if (error.request) {
    return "Unable to connect to the server."
  }

  return fallbackMessage
}
