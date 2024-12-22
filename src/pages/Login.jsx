/* eslint-disable no-unused-vars */
import { useState } from "react"
import logo from "../assets/logo.svg"
import { Eye } from "@phosphor-icons/react"
import { login } from "../libs/api"
import toast from "react-hot-toast"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setError()
      setLoading(true)

      const response = await login({ email, password })

      if (response.success) {
        toast.success(response.message)
        localStorage.setItem("tokenPakar", response.token)
        window.location.replace("/")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 h-screen w-full gap-2">
      <div className="hidden sm:flex items-center justify-center h-screen bg-costumeBlue">
        <img className="blox mx-auto w-56" src={logo} alt="" />
      </div>

      <div className="flex flex-col justify-center items-center col-span-2">
        <h1 className="text-costumeBlue text-md sm:text-4xl font-bold">Login Pakar</h1>
        <br />
        <form
          className="w-[350px] sm:w-full max-w-md xs:max-w-xs mx-auto relative bg-gray-100 shadow-md p-6 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Email Admin"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 text-sm font-bold mr-2">Password</label>
            </div>
            <div className="relative">
              <input
                className="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                type={showPassword ? "text" : "password"}
                placeholder="Masukan password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="absolute top-3 end-2" onClick={(e) => togglePasswordVisibility(e)}>
                <Eye size={28} color="#8A8A8A" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="bg-costumeBlue text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
