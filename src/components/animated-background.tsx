"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function AnimatedBackground() {
  // Define the type for a particle
  interface Particle {
    width: number
    height: number
    left: string
    top: string
    xMove: number
    yMove: number
    duration: number
  }

  // Use state to store the random values to ensure consistency between renders
  const [particles, setParticles] = useState<Particle[]>([])

  // Generate particles only on the client side
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xMove: Math.random() * 100 - 50,
      yMove: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: particle.width,
            height: particle.height,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            x: [0, particle.xMove],
            y: [0, particle.yMove],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

