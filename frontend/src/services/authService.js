import api from "./api"

export const registerUser = async (registerData) => {
  const response = await api.post(
    "/api/auth/register",
    registerData
  )

  return response.data
}
