"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4" // Default server-side state

  return (
    <header className={headerClass}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">B</div>
            </div>
            <span className="font-bold text-xl text-primary">BankName</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium text-primary">
            Home
          </Link>
          <Link href="/login" className="font-medium text-gray-600 hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/register" className="font-medium text-gray-600 hover:text-primary transition-colors">
            Register
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center font-medium text-gray-600 hover:text-primary transition-colors">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Link href="/services/accounts" className="w-full">
                  Accounts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/services/loans" className="w-full">
                  Loans
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/services/cards" className="w-full">
                  Cards
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/services/transactions" className="w-full">
                  Transactions
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/contact" className="font-medium text-gray-600 hover:text-primary transition-colors">
            Contact Us
          </Link>
          <Link href="/about" className="font-medium text-gray-600 hover:text-primary transition-colors">
            About Us
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center font-medium text-gray-600 hover:text-primary transition-colors">
                English <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Spanish</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <Button variant="outline" className="md:hidden">
          Menu
        </Button>
      </div>
    </header>
  )
}

