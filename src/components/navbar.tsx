"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  // Start with isScrolled as false to match server-side rendering
  const [isScrolled, setIsScrolled] = useState(false)
  // Use a separate state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted to avoid hydration mismatch
    setIsMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only apply scroll-based classes after component is mounted
  const headerClass = isMounted
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-transparent py-4"}`
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4" // Default server-side state

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ]

  return (
    <header className={headerClass}>
      <div className="container mx-auto flex items-center justify-between ">
        <div className="flex-shrink-0 px-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">VD</div>
            </div>
            <span className="font-bold text-xl text-primary">Varanta</span>
          </Link>
        </div>

        {/* Center-aligned navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-4">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <motion.li key={link.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  href={link.path}
                  className={`font-medium text-base relative group ${
                    link.path === "/services" ? "text-primary" : "text-gray-600 hover:text-primary"
                  } transition-colors`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Right-aligned buttons */}
        <div className="hidden md:flex items-center space-x-4 px-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Login
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white">Register</Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile menu button */}
        <Button variant="outline" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>
      </div>
    </header>
  )
}

