"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  const sparklesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create random sparkles
    if (sparklesRef.current) {
      const createSparkle = () => {
        const sparkle = document.createElement("div")

        // Random position
        const posX = Math.random() * 100
        const posY = Math.random() * 100

        // Random size
        const size = Math.random() * 4 + 1

        // Random duration
        const duration = Math.random() * 2 + 1

        // Random delay
        const delay = Math.random() * 3

        // Apply styles
        sparkle.style.position = "absolute"
        sparkle.style.left = `${posX}%`
        sparkle.style.top = `${posY}%`
        sparkle.style.width = `${size}px`
        sparkle.style.height = `${size}px`
        sparkle.style.borderRadius = "50%"
        sparkle.style.backgroundColor = "white"
        sparkle.style.boxShadow = "0 0 8px 2px rgba(34, 197, 94, 0.6)"
        sparkle.style.opacity = "0"
        sparkle.style.animation = `sparkleAnimation ${duration}s ease-in-out ${delay}s infinite`

        // Add to container
        sparklesRef.current?.appendChild(sparkle)

        // Remove after some time to prevent memory leaks
        setTimeout(
          () => {
            sparkle.remove()
          },
          (duration + delay) * 1000 * 5,
        )
      }

      // Create initial sparkles
      for (let i = 0; i < 15; i++) {
        createSparkle()
      }

      // Create new sparkles periodically
      const interval = setInterval(() => {
        createSparkle()
      }, 1000)

      // Add keyframes for sparkle animation
      const styleSheet = document.createElement("style")
      styleSheet.textContent = `
        @keyframes sparkleAnimation {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(0); opacity: 0; }
        }
      `
      document.head.appendChild(styleSheet)

      return () => {
        clearInterval(interval)
        document.head.removeChild(styleSheet)
      }
    }
  }, [])

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  // Leaf animation variants
  const leafVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: "backOut",
      },
    },
  }

  // Continuous leaf animation
  const leafMotion = {
    rotate: [0, 5, 0, -5, 0],
    y: [0, -3, 0],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  // Glow animation
  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        initial="hidden"
        animate="visible"
        variants={glowVariants}
        style={{
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.1) 70%, transparent 100%)",
          transform: "scale(1.2)",
        }}
      />

      {/* Container for random sparkles */}
      <div ref={sparklesRef} className="absolute inset-0 overflow-hidden" />

      {/* Main logo container */}
      <motion.div
        className="relative flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Var */}
        <div className="flex items-center">
          <motion.span
            custom={0}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            V
          </motion.span>
          <motion.span
            custom={1}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            a
          </motion.span>
          <motion.span
            custom={2}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            r
          </motion.span>
        </div>

        {/* Leaf icon */}
        <motion.div className="relative mx-1" variants={leafVariants} initial="hidden" animate="visible">
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={leafMotion}
          >
            <path
              d="M6.05023 2.05023C9.78392 2.05023 12.8499 3.34645 14.9501 5.44666C17.0503 7.54688 18.3465 10.6129 18.3465 14.3465C18.3465 14.8603 18.3177 15.3591 18.2617 15.8432C19.7702 16.5819 21.0312 17.7116 21.8334 19.1301C21.9222 19.2923 21.9487 19.4797 21.9081 19.6588C21.8675 19.8379 21.7624 19.9969 21.6126 20.1037C21.4628 20.2105 21.2786 20.2573 21.0968 20.2349C20.915 20.2125 20.7474 20.1224 20.6266 19.9828C19.1334 18.2258 16.9334 17.1432 14.5 17.1432C13.7719 17.1432 13.0765 17.2266 12.4138 17.3848C12.2927 17.4134 12.1671 17.4134 12.046 17.3848C11.3833 17.2266 10.6879 17.1432 9.95982 17.1432C7.52646 17.1432 5.32646 18.2258 3.83317 19.9828C3.71238 20.1224 3.54481 20.2125 3.36301 20.2349C3.18121 20.2573 2.99704 20.2105 2.84723 20.1037C2.69742 19.9969 2.59226 19.8379 2.55167 19.6588C2.51108 19.4797 2.53761 19.2923 2.62646 19.1301C3.42869 17.7116 4.68965 16.5819 6.19816 15.8432C6.14211 15.3591 6.11328 14.8603 6.11328 14.3465C6.11328 11.3465 7.05023 8.71688 8.65023 6.71688"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.05023 2.05023C9.78392 2.05023 12.8499 3.34645 14.9501 5.44666C17.0503 7.54688 18.3465 10.6129 18.3465 14.3465"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        {/* Daan */}
        <div className="flex items-center">
          <motion.span
            custom={3}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            D
          </motion.span>
          <motion.span
            custom={4}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            a
          </motion.span>
          <motion.span
            custom={5}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            a
          </motion.span>
          <motion.span
            custom={6}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-emerald-600"
          >
            n
          </motion.span>
        </div>

        {/* Grow */}
        <div className="flex items-center ml-1">
          <motion.span
            custom={7}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
          >
            G
          </motion.span>
          <motion.span
            custom={8}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
          >
            r
          </motion.span>
          <motion.span
            custom={9}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
          >
            o
          </motion.span>
          <motion.span
            custom={10}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
          >
            w
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}

