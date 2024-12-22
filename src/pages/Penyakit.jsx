import React, { useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { toast } from "react-hot-toast"
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/outline"
import axios from "axios"

const Penyakit = () => {
  const [penyakitList, setPenyakitList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentPenyakit, setCurrentPenyakit] = useState(null)
  const [form, setForm] = useState({ nama: "", deskripsi: "", solusi: "" })
  const [loading, setLoading] = useState(false)
  const [gejalaList, setGejalaList] = useState([])
  const [isGejalaOpen, setIsGejalaOpen] = useState(false)

  const token = localStorage.getItem("tokenPakar")

  useEffect(() => {
    fetchPenyakit()
  }, [])

  const fetchPenyakit = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/pakar/penyakit`)
      setPenyakitList(response.data)
    } catch (error) {
      toast.error("Gagal mengambil data penyakit.")
    }
  }

  const fetchGejala = async (penyakitId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/gejala/${penyakitId}/gejala`
      )
      setGejalaList(response.data)
      setIsGejalaOpen(true)
    } catch (error) {
      toast.error("Gagal mengambil data gejala.")
    }
  }

  const handleGejalaDelete = async (gejala) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/gejala/${gejala.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Gejala berhasil dihapus!")
      fetchGejala(currentPenyakit?.id) // Refresh gejala list
    } catch (error) {
      toast.error("Gagal menghapus data gejala.")
    }
  }

  const handleOpenModal = (penyakit = null) => {
    setCurrentPenyakit(penyakit)
    setForm(penyakit || { id: "", nama: "", deskripsi: "", solusi: "" }) // Tambahkan id
    setIsOpen(true)
  }

  const handleDeleteModal = (penyakit) => {
    setCurrentPenyakit(penyakit)
    setIsDeleteOpen(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL

      if (!currentPenyakit && !form.id) {
        toast.error("ID penyakit harus diisi.")
        return
      }

      if (currentPenyakit) {
        // Update penyakit
        await axios.patch(`${BASE_URL}/api/v1/penyakit/${currentPenyakit.id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        toast.success("Penyakit berhasil diperbarui!")
      } else {
        // Create penyakit
        await axios.post(`${BASE_URL}/api/v1/penyakit`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        toast.success("Penyakit berhasil ditambahkan!")
      }

      fetchPenyakit()
      setIsOpen(false)
    } catch (error) {
      console.error("Error details:", error.response || error.message)
      toast.error(error.response?.data?.message || "Gagal menyimpan data penyakit.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL
      await axios.delete(`${BASE_URL}/api/v1/penyakit/${currentPenyakit.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Penyakit berhasil dihapus!")
      fetchPenyakit()
      setIsDeleteOpen(false)
    } catch (error) {
      console.error("Error details:", error.response || error.message)
      toast.error(error.response?.data?.message || "Gagal menghapus data penyakit.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Penyakit</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 flex items-center"
        onClick={() => handleOpenModal()}
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Tambah Penyakit
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {penyakitList.map((penyakit) => (
          <div key={penyakit.id} className="p-4 bg-white shadow-md rounded-lg border">
            <h2 className="text-lg font-semibold">{penyakit.nama}</h2>
            <p className="text-sm text-gray-600 mt-2">Deskripsi: {penyakit.deskripsi}</p>
            <p className="text-sm text-gray-600 mt-2">Solusi: {penyakit.solusi}</p>
            <div className="flex justify-start mt-4 gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                onClick={() => handleOpenModal(penyakit)}
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                onClick={() => handleDeleteModal(penyakit)}
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete
              </button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded flex items-center"
                onClick={() => fetchGejala(penyakit.id)}
              >
                More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Update */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  {currentPenyakit ? "Edit Penyakit" : "Tambah Penyakit"}
                </Dialog.Title>
                <div className="mt-4">
                  {!currentPenyakit && (
                    <input
                      type="text"
                      placeholder="ID Penyakit"
                      value={form.id || ""}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      className="w-full p-2 border rounded mb-2"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Nama Penyakit"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea
                    placeholder="Deskripsi"
                    value={form.deskripsi}
                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea
                    placeholder="Solusi"
                    value={form.solusi}
                    onChange={(e) => setForm({ ...form, solusi: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                  >
                    {loading ? "Loading..." : "Simpan"}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for Delete Confirmation */}
      <Transition appear show={isDeleteOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Hapus Penyakit
                </Dialog.Title>
                <div className="mt-2">
                  <p>Apakah Anda yakin ingin menghapus penyakit ini?</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDelete}
                  >
                    {loading ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isGejalaOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsGejalaOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Data Gejala
                </Dialog.Title>
                <div className="mt-4">
                  {gejalaList.map((gejala) => (
                    <div key={gejala.id} className="p-2 border rounded mb-2">
                      <h3 className="font-semibold">{gejala.nama}</h3>
                      <p className="text-sm">{gejala.deskripsi}</p>
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleGejalaDelete(gejala)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default Penyakit
