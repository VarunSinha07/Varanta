"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  delay: number;
}

export default function FeatureCard({ icon, title, description, ctaText, ctaLink, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={ctaLink} className="text-primary font-medium hover:underline inline-flex items-center">
        {ctaText}
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  )
}

