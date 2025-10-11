"use client"

import type React from "react"

import { type ReactNode, useCallback, useState } from "react"
import { DesktopIcon } from "./desktop-icon"
import { FolderPlus, RefreshCw, Settings, Image } from "lucide-react"
import { useContextMenu } from "./context-menu/context-menu-provider"
import { useFileSystem } from "@/contexts/file-system-context"

interface MacOSDesktopProps {
  children: ReactNode
}

export function MacOSDesktop({ children }: MacOSDesktopProps) {
  const { showContextMenu } = useContextMenu()
  const { getFilesByParent, moveFile } = useFileSystem()
  const [isDragOver, setIsDragOver] = useState(false)

  const desktopFiles = getFilesByParent("desktop")

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      showContextMenu({
        items: [
          {
            label: "New Folder",
            icon: <FolderPlus className="h-4 w-4" />,
            onClick: () => console.log("New Folder clicked"),
          },
          {
            label: "Change Wallpaper",
            icon: <Image className="h-4 w-4" />,
            onClick: () => console.log("Change Wallpaper clicked"),
          },
          { divider: true },
          {
            label: "Refresh",
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: () => console.log("Refresh clicked"),
          },
          {
            label: "Show View Options",
            icon: <Settings className="h-4 w-4" />,
            onClick: () => console.log("Show View Options clicked"),
          },
        ],
        x: e.clientX,
        y: e.clientY,
      })
    },
    [showContextMenu],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data.fileId) {
        moveFile(data.fileId, "desktop")
      }
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat ${
        isDragOver ? "bg-blue-500/10" : ""
      }`}
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mojave.jpg-hdg3vqcacn0TYgsBwdpHZ5QOOvX6he.jpeg')",
        backgroundColor: "#1a1a1a",
      }}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute right-6 top-6">
        <DesktopIcon
          file={{
            id: "macintosh-hd",
            name: "Macintosh HD",
            type: "folder",
            parent: "root",
          }}
        />
      </div>

      <div className="absolute left-6 top-6 grid grid-cols-1 gap-4">
        {desktopFiles.map((file) => (
          <DesktopIcon key={file.id} file={file} onDoubleClick={() => console.log(`Open ${file.name}`)} />
        ))}
      </div>

      {children}
    </div>
  )
}
