"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, CreditCard, Home, Landmark, Layers, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileCheck from "@/components/profile-check"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: CreditCard, label: "Accounts", href: "/dashboard/accounts" },
  { icon: BarChart3, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Layers, label: "Cards", href: "/dashboard/cards" },
  { icon: Landmark, label: "Loans", href: "/dashboard/loans" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
]

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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileCheck>
      <div className="flex min-h-screen bg-gray-50 mt-24">
        <motion.aside
          className="w-64 bg-white border-r border-gray-100 shadow-sm p-4"
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
        >
          <motion.div className="mb-8 flex items-center" variants={itemVariants}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                <Landmark className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Banking App
              </h1>
            </div>
          </motion.div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div className="pt-6 border-t border-gray-100 mt-8" variants={itemVariants}>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Contact Support
              </Button>
            </div>
          </motion.div>
        </motion.aside>

        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </ProfileCheck>
  )
}