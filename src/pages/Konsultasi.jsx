import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Dialog } from "@headlessui/react"

const Konsultasi = () => {
  const [questions, setQuestions] = useState([])
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState(null)
  const token = localStorage.getItem("tokenPakar")

  // Ambil semua pertanyaan dari server
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/question/pakar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setQuestions(response.data.questions)
    } catch (error) {
      toast.error("Gagal mengambil data pertanyaan")
    }
  }

  // Menjawab pertanyaan
  const handleAnswerQuestion = async (questionId) => {
    if (!answer) {
      toast.error("Jawaban tidak boleh kosong")
      return
    }

    try {
      setLoading(true)
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/question/answer/${questionId}`,
        {
          jawabannya: answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        toast.success("Pertanyaan berhasil dijawab")
        fetchQuestions() // Refresh data pertanyaan
        setAnswer("")
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error("Gagal memberikan jawaban")
    } finally {
      setLoading(false)
    }
  }

  // Menangani pembukaan modal jawaban
  const openModal = (questionId) => {
    setCurrentQuestionId(questionId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setAnswer("")
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-white mb-6">Konsultasi</h1>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-costumeBlue text-white">
              <tr>
                <th className="px-6 py-3 border-b text-left">Nama User</th>
                <th className="px-6 py-3 border-b text-left">Pertanyaan</th>
                <th className="px-6 py-3 border-b text-left">Tanggal Dibuat</th>
                <th className="px-6 py-3 border-b text-left">Jawaban</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 border-b">{question.User.nama}</td>
                  <td className="px-6 py-4 border-b">{question.pertanyaan}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(question.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {question.is_answered ? (
                      <span className="text-green-500">Sudah dijawab</span>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                        onClick={() => openModal(question.id)}
                      >
                        Jawab
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk menjawab pertanyaan */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white rounded-lg w-1/3 p-6">
            <Dialog.Title className="text-xl font-semibold mb-4">Jawab Pertanyaan</Dialog.Title>
            <textarea
              className="w-full border p-2 rounded-md mb-4"
              placeholder="Jawaban"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleAnswerQuestion(currentQuestionId)}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Jawab"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default Konsultasi
