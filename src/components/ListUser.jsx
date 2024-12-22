import axios from "axios"
import React, { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const ListUser = () => {
  const [users, setUsers] = useState([])
  const [diagnosa, setDiagnosa] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/pakar/user/list`)
      .then((response) => setUsers(response.data.data))
      .catch((err) => console.error(err))
  }, [])

  const deleteUser = (id) => {
    setLoading(true)
    axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/pakar/user/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
        toast.success("User berhasil dihapus!")
        setShowConfirm(false)
      })
      .catch((err) => console.error(err))
      .finally(setLoading(false))
  }

  const getDiagnosaByUserId = (userId) => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/pakar/user/diagnosa/${userId}`)
      .then((response) => {
        setDiagnosa((prevDiagnosa) => ({
          ...prevDiagnosa,
          [userId]: response.data.data,
        }))
        setModalContent({
          title: "Diagnosa",
          content: response.data.data.map((item) => item.Penyakit.nama).join(", "),
        })
        setShowModal(true)
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="mt-6 px-4">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">List User</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-costumeBlue text-white">
              <th className="border border-gray-400 p-3 text-sm sm:text-base">Nama</th>
              <th className="border border-gray-400 p-3 text-sm sm:text-base">Email</th>
              <th className="border border-gray-400 p-3 text-sm sm:text-base">Verifikasi</th>
              <th className="border border-gray-400 p-3 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="even:bg-gray-100">
                <td className="border border-gray-400 p-3 text-sm sm:text-base">{user.nama}</td>
                <td className="border border-gray-400 p-3 text-sm sm:text-base">{user.email}</td>
                <td className="border border-gray-400 p-3 text-sm sm:text-base">
                  {user.isVerified ? "Iya" : "Tidak"}
                </td>
                <td className="border border-gray-400 p-3 text-sm sm:text-base">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded mr-2 text-xs sm:text-sm"
                    onClick={() => getDiagnosaByUserId(user.id)}
                  >
                    Diagnosa
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm"
                    onClick={() => {
                      setDeleteId(user.id)
                      setShowConfirm(true)
                    }}
                  >
                    {loading ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Diagnosa */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6">
            <h3 className="text-xl font-bold mb-4">{modalContent.title}</h3>
            <p className="text-gray-700">{modalContent.content}</p>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Penghapusan */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6">
            <h3 className="text-xl font-bold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-700">Apakah Anda yakin ingin menghapus user ini?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => deleteUser(deleteId)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListUser
