"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { BarChart3, Users, CreditCard, FileCheck, LogOut, Menu, Home, DollarSign, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarLink {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const sidebarVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const sidebarLinks: SidebarLink[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: "Accounts",
      href: "/admin/accounts",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      name: "Approvals",
      href: "/admin/approvals",
      icon: <FileCheck className="h-4 w-4" />,
      badge: "New",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 mt-24">
      {/* Sidebar for desktop */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-gray-100 p-4",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <div className="flex h-full flex-col">
          <motion.div className="mb-8 flex items-center" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <Landmark className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </div>
          </motion.div>

          <nav className="flex-1 space-y-2">
            {sidebarLinks.map((link) => (
              <motion.div key={link.name} variants={itemVariants}>
                <Link href={link.href} passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-600",
                      pathname === link.href
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium"
                        : "hover:text-emerald-700 hover:bg-emerald-50",
                    )}
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                    {link.badge && (
                      <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        {link.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div className="pt-6 border-t border-gray-100 mt-8" variants={itemVariants}>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Contact Support
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-200"
              onClick={() => {
                // Handle logout
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

          
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
