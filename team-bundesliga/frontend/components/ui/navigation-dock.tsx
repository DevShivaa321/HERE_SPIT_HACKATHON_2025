"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Home, Layers, MessageSquare } from "lucide-react"
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock"

interface NavItem {
  title: string
  icon: React.ReactNode
  href: string
}

export function NavigationDock() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const navItems: NavItem[] = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-purple-600 dark:text-purple-400" />,
      href: "#",
    },
    {
      title: "Features",
      icon: <Layers className="h-full w-full text-purple-600 dark:text-purple-400" />,
      href: "#features",
    },
    {
      title: "Reviews",
      icon: <MessageSquare className="h-full w-full text-purple-600 dark:text-purple-400" />,
      href: "#testimonials",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      window.location.href = href
    }
  }

  // Only show dock on the home page
  if (pathname !== "/") {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 px-4 ${
        scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Dock className="items-end pb-3 shadow-lg" magnification={60} distance={100} panelHeight={48}>
        {navItems.map((item, idx) => (
          <DockItem
            key={idx}
            className="aspect-square rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
            onClick={() => handleClick(item.href)}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}
