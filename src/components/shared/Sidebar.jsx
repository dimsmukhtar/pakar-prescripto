import logo from "../../assets/logo.svg"
import { SIDEBAR_LINKS } from "../../libs/sidebarMenu.jsx"
import { Link, useLocation, useNavigate } from "react-router-dom"
import classNames from "classnames"
import { SignOut } from "@phosphor-icons/react"
import { swalFireConfirm, swalFireResult } from "../../libs/swalFire.js"

const linkClass =
  "flex items-center gap-2 font-bold text-md px-3 py-2 hover:bg-blue-400 hover:no-underline active:bg-indigo-600 rounded-lg text-base"

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = async () => {
    try {
      const result = await swalFireConfirm("Yakin ingin keluar?", "", "warning")

      if (result.isConfirmed) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    } catch (err) {
      swalFireResult("Gagal", "Gagal keluar dari akun", "error")
    }
  }

  return (
    <div className="bg-costumeBlue  w-full flex flex-col items-center md:w-56 itransition-all py-2 rounded-t-lg md:rounded-none">
      <div className="hidden md:flex  items-center justify-center py-10">
        <img src={logo} className="w-10 md:w-20" alt="" />
      </div>
      <div className="flex flex-row md:flex-col items-start gap-14 md:gap-3 justify-between md:justify-start">
        {SIDEBAR_LINKS.map((link, index) => (
          <div key={index}>
            <Link
              key={link.key}
              to={link.path}
              className={classNames(
                pathname === link.path ? "bg-blue-500 text-white" : "text-white",
                linkClass
              )}
            >
              <span>{link.icon}</span>
              <span className="hidden sm:block">{link.label}</span>
            </Link>
          </div>
        ))}

        <div>
          <button
            onClick={() => handleLogout()}
            type="button"
            className="flex items-center gap-2 text-white hover:bg-blue-400 hover:no-underline active:bg-indigo-600 rounded-lg text-base px-3 py-2 font-bold w-full"
          >
            <span>
              <SignOut size={24} color="#ffffff" weight="bold" />
            </span>
            <h2 className="hidden sm:block">keluar</h2>
          </button>
        </div>
      </div>
    </div>
  )
}
