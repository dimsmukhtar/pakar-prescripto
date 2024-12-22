import icons from "../assets/icon_user.svg"
import { useState, useEffect } from "react"
import { getDataDashboard } from "../libs/api"
import { Book } from "@phosphor-icons/react"

export default function DataCard() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchDashoard = async () => {
      const dataDashobard = await getDataDashboard()
      setData(dataDashobard)
    }
    fetchDashoard()
  }, [])

  return (
    <div className="grid md:grid-cols-3 grid-cols-2 py-4 md:py-8 gap-2 mx-2 transition-all">
      <div className=" bg-blue-500 rounded-2xl p-5 flex-auto border border-gray-200 flex items-center">
        <div className="rounded-full w-12 flex items-center justify-center">
          <img className="text-sm md:text-xl text-white" src={icons} alt="" />
        </div>
        <div className="pl-4">
          <span className="text-base text-white ">{data.verifiedUsers}</span>
          <div className="flex items-center">
            <strong className="text-xs md:text-xl text-white">Pasien Terverifikasi</strong>
          </div>
        </div>
      </div>
      <div className=" bg-green-500 rounded-2xl p-5 flex-auto border border-gray-200 flex items-center">
        <div className="rounded-2xl p-2 bg-white flex items-center justify-center">
          <Book size={32} className="text-costumeBlue text-sm md:text-xl" weight="bold" />
        </div>
        <div className="pl-4">
          <span className="text-base text-white ">{data.gejalas}</span>
          <div className="flex items-center">
            <strong className="text-xs md:text-xl text-white">Gejala</strong>
          </div>
        </div>
      </div>
      <div className=" bg-indigo-600 rounded-2xl p-5 flex-auto border border-gray-200 flex items-center col-span-2 md:col-auto">
        <div className="rounded-2xl p-2 bg-white flex items-center justify-center">
          <Book size={32} className="text-costumeBlue text-sm md:text-xl" weight="bold" />
        </div>
        <div className="pl-4">
          <span className="text-base text-white ">{data.penyakits}</span>
          <div className="flex items-center">
            <strong className="text-xs md:text-xl text-white">Penyakit</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
