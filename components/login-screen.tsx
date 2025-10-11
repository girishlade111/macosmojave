"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, ChevronRight } from "lucide-react"

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void
  error: string | null
}

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [shake, setShake] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
      setCurrentTime(now.toLocaleString("en-US", timeOptions))
      setCurrentDate(now.toLocaleString("en-US", dateOptions))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (error) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-macbook-pro-stock-2021-apple-event-2021-dark-mode-6016x5468-6759.jpg-OszWN0T7VqImNbo7NSwFeiJT4D0kYk.jpeg')",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div className="text-center mb-auto mt-8">
        <div className="text-white/90 text-5xl font-light">{currentTime}</div>
        <div className="text-white/80 text-xl mt-1">{currentDate}</div>
      </div>

      <div
        className={`bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl w-80 p-8 flex flex-col items-center ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center mb-6 border-2 border-white/10 overflow-hidden">
          <img src="/images/user-profile.webp" alt="User Avatar" className="w-full h-full object-cover" />
        </div>

        <div className="text-white text-xl font-medium mb-6">John Doe</div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/20 backdrop-blur border ${
                error ? "border-red-500" : "border-white/20"
              } rounded-md px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Lock className="w-4 h-4" />
              <span>Hint: admin</span>
            </div>

            <button
              type="submit"
              className="rounded-full w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="mt-auto mb-6 flex items-center gap-4">
        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1">
          <Sleep className="w-4 h-4" />
          <span>Sleep</span>
        </button>
        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1">
          <RefreshCw className="w-4 h-4" />
          <span>Restart</span>
        </button>
        <button className="text-white/70 hover:text-white text-sm flex items-center gap-1">
          <Power className="w-4 h-4" />
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  )
}

function Sleep(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
      <path d="M9 9h.01" />
    </svg>
  )
}

function Power(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v10" />
      <path d="M8 13a5 5 0 1 0 8 0" />
    </svg>
  )
}

function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 3v7h-7" />
      <path d="M3 21v-7h7" />
      <path d="M18 8.3A9 9 0 1 0 5.7 16" />
    </svg>
  )
}
