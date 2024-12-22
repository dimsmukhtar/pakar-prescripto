/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Penyakit from "./pages/Penyakit"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/shared/Layout"
import Konsultasi from "./pages/Konsultasi"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="penyakit" element={<Penyakit />} />
        <Route path="konsultasi" element={<Konsultasi />} />
      </Route>
    </Routes>
  )
}

export default App
