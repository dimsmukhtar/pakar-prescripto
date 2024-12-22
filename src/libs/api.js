/* eslint-disable no-unused-vars */
import axios from "axios"

const token = localStorage.getItem("tokenPakar")

export const login = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/pakar/login`, {
      email: data.email,
      password: data.password,
    })
    return response.data
  } catch (error) {
    throw error.response?.data
  }
}

export const getDataDashboard = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/pakar/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data.data
  } catch (error) {
    throw error.response?.data
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data
  }
}
