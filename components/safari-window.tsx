"use client"

import type React from "react"

import { useState, useRef, useEffect, type MouseEvent } from "react"
import { DraggableWindow } from "./draggable-window"
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Shield,
  Star,
  Plus,
  SidebarClose,
  Search,
  X,
  ChevronDown,
  Copy,
  ExternalLink,
  Code,
} from "lucide-react"
import { useContextMenu } from "./context-menu/context-menu-provider"

interface SafariWindowProps {
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onMaximize: () => void
  isMaximized?: boolean
}

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
}

export function SafariWindow({
  zIndex,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
  onMaximize,
  isMaximized,
}: SafariWindowProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "tab1",
      title: "Amir Salmani",
      url: "https://amirsalmani.com",
      favicon: "/icons/safari.webp",
      isActive: true,
    },
  ])

  const [inputUrl, setInputUrl] = useState("https://amirsalmani.com")
  const [currentUrl, setCurrentUrl] = useState("https://amirsalmani.com")
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const urlHistory = useRef<string[]>([])
  const historyPosition = useRef<number>(0)
  const { showContextMenu } = useContextMenu()

  const addTab = () => {
    // Set all tabs to inactive
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      isActive: false,
    }))

    // Add new active tab
    setTabs([
      ...updatedTabs,
      {
        id: `tab${tabs.length + 1}`,
        title: "New Tab",
        url: "about:blank",
        isActive: true,
      },
    ])

    setInputUrl("about:blank")
    setCurrentUrl("about:blank")
    urlHistory.current = ["about:blank"]
    historyPosition.current = 0
    setCanGoBack(false)
    setCanGoForward(false)
  }

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (tabs.length === 1) {
      // Don't close the last tab
      return
    }

    const tabIndex = tabs.findIndex((tab) => tab.id === id)
    const isActiveTab = tabs[tabIndex].isActive

    // Remove the tab
    const newTabs = tabs.filter((tab) => tab.id !== id)

    // If we closed the active tab, activate another one
    if (isActiveTab && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1)
      newTabs[newActiveIndex].isActive = true
      setInputUrl(newTabs[newActiveIndex].url)
      setCurrentUrl(newTabs[newActiveIndex].url)

      // Reset history for the newly active tab
      urlHistory.current = [newTabs[newActiveIndex].url]
      historyPosition.current = 0
      setCanGoBack(false)
      setCanGoForward(false)
    }

    setTabs(newTabs)
  }

  const activateTab = (id: string) => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === id,
    }))

    const activeTab = updatedTabs.find((tab) => tab.id === id)
    if (activeTab) {
      setInputUrl(activeTab.url)
      setCurrentUrl(activeTab.url)

      // Reset history for the newly active tab
      urlHistory.current = [activeTab.url]
      historyPosition.current = 0
      setCanGoBack(false)
      setCanGoForward(false)
    }

    setTabs(updatedTabs)
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let url = inputUrl.trim()

    // Add https:// if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
      setInputUrl(url)
    }

    // Update the current tab
    const updatedTabs = tabs.map((tab) => {
      if (tab.isActive) {
        return {
          ...tab,
          url,
          title: url.replace(/^https?:\/\//, "").split("/")[0],
        }
      }
      return tab
    })

    setTabs(updatedTabs)
    setCurrentUrl(url)

    // Add to history
    urlHistory.current = urlHistory.current.slice(0, historyPosition.current + 1)
    urlHistory.current.push(url)
    historyPosition.current = urlHistory.current.length - 1

    setCanGoBack(historyPosition.current > 0)
    setCanGoForward(false)

    setIsLoading(true)
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = currentUrl
    }
  }

  const handleGoBack = () => {
    if (historyPosition.current > 0) {
      historyPosition.current--
      const prevUrl = urlHistory.current[historyPosition.current]

      // Update the current tab
      const updatedTabs = tabs.map((tab) => {
        if (tab.isActive) {
          return {
            ...tab,
            url: prevUrl,
            title: prevUrl.replace(/^https?:\/\//, "").split("/")[0],
          }
        }
        return tab
      })

      setTabs(updatedTabs)
      setInputUrl(prevUrl)
      setCurrentUrl(prevUrl)
      setIsLoading(true)

      setCanGoBack(historyPosition.current > 0)
      setCanGoForward(historyPosition.current < urlHistory.current.length - 1)
    }
  }

  const handleGoForward = () => {
    if (historyPosition.current < urlHistory.current.length - 1) {
      historyPosition.current++
      const nextUrl = urlHistory.current[historyPosition.current]

      // Update the current tab
      const updatedTabs = tabs.map((tab) => {
        if (tab.isActive) {
          return {
            ...tab,
            url: nextUrl,
            title: nextUrl.replace(/^https?:\/\//, "").split("/")[0],
          }
        }
        return tab
      })

      setTabs(updatedTabs)
      setInputUrl(nextUrl)
      setCurrentUrl(nextUrl)
      setIsLoading(true)

      setCanGoBack(historyPosition.current > 0)
      setCanGoForward(historyPosition.current < urlHistory.current.length - 1)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleSafariContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    showContextMenu({
      items: [
        {
          label: "Reload Page",
          icon: <RefreshCw className="h-4 w-4" />,
          onClick: handleRefresh,
        },
        {
          label: "Copy Link",
          icon: <Copy className="h-4 w-4" />,
          onClick: () => {
            navigator.clipboard.writeText(currentUrl)
          },
        },
        { divider: true },
        {
          label: "Open in New Window",
          icon: <ExternalLink className="h-4 w-4" />,
          onClick: () => console.log("Open in New Window"),
        },
        {
          label: "Inspect",
          icon: <Code className="h-4 w-4" />,
          onClick: () => console.log("Inspect"),
        },
      ],
      x: e.clientX,
      y: e.clientY,
    })
  }

  // Initialize history on mount
  useEffect(() => {
    urlHistory.current = [currentUrl]
    historyPosition.current = 0
  }, [])

  const activeTab = tabs.find((tab) => tab.isActive) || tabs[0]

  return (
    <DraggableWindow
      title="Safari"
      width={size.width}
      height={size.height}
      zIndex={zIndex}
      position={position}
      onClose={onClose}
      onFocus={onFocus}
      onDrag={onDrag}
      onResize={onResize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
    >
      <div className="flex flex-col h-full">
        {/* Tab Bar */}
        <div className="flex items-center bg-[#2d2d2d] border-b border-[#3a3a3a] px-2 h-9">
          <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => activateTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-t-lg mr-1 max-w-[200px] min-w-[100px] cursor-default ${
                  tab.isActive ? "bg-[#3a3a3a]" : "bg-[#323232] hover:bg-[#353535]"
                }`}
              >
                {tab.favicon ? (
                  <img src={tab.favicon || "/placeholder.svg"} alt="" className="w-3 h-3" />
                ) : (
                  <img src="/icons/safari.webp" alt="" className="w-3 h-3" />
                )}
                <span className="text-xs text-white/80 truncate flex-1">{tab.title}</span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="w-4 h-4 rounded-full hover:bg-[#4a4a4a] flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white/60" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addTab}
            className="w-6 h-6 rounded-full hover:bg-[#3a3a3a] flex items-center justify-center ml-1"
          >
            <Plus className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-[#3a3a3a]">
          <div className="flex items-center gap-1">
            <button
              className={`w-8 h-8 rounded-full ${canGoBack ? "hover:bg-white/10 text-white/70" : "text-white/30"} flex items-center justify-center`}
              onClick={handleGoBack}
              disabled={!canGoBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              className={`w-8 h-8 rounded-full ${canGoForward ? "hover:bg-white/10 text-white/70" : "text-white/30"} flex items-center justify-center`}
              onClick={handleGoForward}
              disabled={!canGoForward}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 mx-2">
            <div className="flex items-center bg-[#1d1d1d] rounded-lg h-8 px-3">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white/80 flex-1"
              />
              <button
                type="button"
                onClick={handleRefresh}
                className={`w-6 h-6 flex items-center justify-center rounded-full ${isLoading ? "animate-spin" : "hover:bg-white/10"}`}
              >
                <RefreshCw className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <Star className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <SidebarClose className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center px-3 py-1 bg-[#262626] border-b border-[#3a3a3a] text-xs text-white/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <img src="/icons/safari.webp" alt="" className="w-3 h-3" />
              <span>Amir Salmani</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <img src="/icons/safari.webp" alt="" className="w-3 h-3" />
              <span>Safari</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <img src="/icons/icloud-favicon.png" alt="" className="w-3 h-3" />
              <span>iCloud</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <img src="/icons/news-favicon.png" alt="" className="w-3 h-3" />
              <span>News</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-default">
              <img src="/icons/maps-favicon.png" alt="" className="w-3 h-3" />
              <span>Maps</span>
            </div>
          </div>
          <div className="ml-auto">
            <button className="flex items-center gap-1 hover:text-white">
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Safari Content with iframe */}
        <div className="flex-1 bg-white overflow-hidden">
          {activeTab.url === "about:blank" ? (
            <div className="h-full flex flex-col items-center justify-center bg-[#f5f5f7] text-black">
              <div className="w-16 h-16 mb-4">
                <img src="/icons/safari.webp" alt="Safari" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-semibold mb-6">New Tab</h2>
              <div className="relative w-full max-w-lg">
                <form onSubmit={handleUrlSubmit}>
                  <input
                    type="text"
                    placeholder="Search or enter website name"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full h-10 px-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-white" onContextMenu={handleSafariContextMenu}>
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="w-full h-full border-none"
                onLoad={handleIframeLoad}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                title="Safari Browser"
              />
            </div>
          )}
        </div>
      </div>
    </DraggableWindow>
  )
}
