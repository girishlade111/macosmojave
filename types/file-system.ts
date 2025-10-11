export interface FileItem {
  id: string
  name: string
  type: "file" | "folder" | "app"
  icon?: string
  parent: string
  size?: string
  modified?: string
  extension?: string
  content?: string
  path?: string
}

export interface FileSystem {
  items: Record<string, FileItem>
  desktop: string[]
  documents: string[]
  downloads: string[]
  applications: string[]
  trash: string[]
}

export const initialFileSystem: FileSystem = {
  items: {
    "desktop-1": {
      id: "desktop-1",
      name: "Untitled Document",
      type: "file",
      parent: "desktop",
      extension: "txt",
      size: "2 KB",
      modified: new Date().toLocaleDateString(),
      content: "Welcome to macOS Mojave!",
    },
    "desktop-2": {
      id: "desktop-2",
      name: "Projects",
      type: "folder",
      parent: "desktop",
      modified: new Date().toLocaleDateString(),
    },
    "desktop-3": {
      id: "desktop-3",
      name: "Vacation Photos",
      type: "folder",
      parent: "desktop",
      modified: new Date().toLocaleDateString(),
    },
    "documents-1": {
      id: "documents-1",
      name: "Resume",
      type: "file",
      parent: "documents",
      extension: "pdf",
      size: "245 KB",
      modified: new Date().toLocaleDateString(),
    },
    "documents-2": {
      id: "documents-2",
      name: "Meeting Notes",
      type: "file",
      parent: "documents",
      extension: "txt",
      size: "4 KB",
      modified: new Date().toLocaleDateString(),
    },
    "documents-3": {
      id: "documents-3",
      name: "Persian Book",
      type: "file",
      parent: "documents",
      extension: "pdf",
      size: "1.2 MB",
      modified: new Date().toLocaleDateString(),
      path: "/documents/persian-book.pdf",
    },
    "downloads-1": {
      id: "downloads-1",
      name: "mojave-wallpaper",
      type: "file",
      parent: "downloads",
      extension: "jpg",
      size: "3.2 MB",
      modified: new Date().toLocaleDateString(),
    },
    "applications-1": {
      id: "applications-1",
      name: "Safari",
      type: "app",
      parent: "applications",
      icon: "/icons/safari.webp",
      modified: new Date().toLocaleDateString(),
    },
    "applications-2": {
      id: "applications-2",
      name: "Terminal",
      type: "app",
      parent: "applications",
      icon: "/icons/terminal.webp",
      modified: new Date().toLocaleDateString(),
    },
  },
  desktop: ["desktop-1", "desktop-2", "desktop-3"],
  documents: ["documents-1", "documents-2", "documents-3"],
  downloads: ["downloads-1"],
  applications: ["applications-1", "applications-2"],
  trash: [],
}
