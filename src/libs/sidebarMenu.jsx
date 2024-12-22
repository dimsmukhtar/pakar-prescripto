import { House, Book } from "@phosphor-icons/react"

export const SIDEBAR_LINKS = [
  {
    key: "home",
    label: "Dashboard",
    path: "/",
    icon: <House size={24} weight="bold" />,
  },
  {
    key: "kelola_kelas",
    label: "Kelola Penyakit",
    path: "/penyakit",
    icon: <Book size={24} weight="bold" />,
  },
  {
    key: "kelola_kelas",
    label: "Kelola Konsultasi",
    path: "/konsultasi",
    icon: <Book size={24} weight="bold" />,
  },
]
