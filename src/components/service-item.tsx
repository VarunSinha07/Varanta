"use client"

import { motion } from "framer-motion"

interface ServiceItemProps {
  title: string;
  description: string;
  delay: number;
}

export default function ServiceItem({ title, description, delay }: ServiceItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-primary"></div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

