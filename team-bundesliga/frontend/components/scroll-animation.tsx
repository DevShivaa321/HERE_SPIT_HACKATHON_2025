"use client"

import { useEffect } from "react"

export function ScrollAnimation() {
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll(
        ".animate-on-scroll, .animate-slide-in-left, .animate-slide-in-right, .animate-fade-in",
      )

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0

        if (isInView) {
          element.classList.add("in-view")
        }
      })
    }

    // Run once on load
    animateElements()

    // Add scroll event listener
    window.addEventListener("scroll", animateElements)

    return () => {
      window.removeEventListener("scroll", animateElements)
    }
  }, [])

  return null
}
