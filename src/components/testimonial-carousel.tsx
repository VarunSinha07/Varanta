"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function TestimonialCarousel() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote: "This platform made managing my accounts so easy! I love the real-time transaction updates.",
      author: "Sarah M., Customer Since 2023",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      quote: "Applying for a loan was seamless, and the interest rates are fantastic!",
      author: "John D., Customer Since 2022",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      quote: "I feel secure knowing my data is protected. Great service!",
      author: "Emily R., Customer Since 2024",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  useEffect(() => {
    setIsMounted(true)

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  // Don't apply transform until component is mounted to avoid hydration mismatch
  const carouselStyle = isMounted
    ? { transform: `translateX(-${activeIndex * 100}%)` }
    : { transform: "translateX(0%)" }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={carouselStyle}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="text-gray-500 font-medium">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? "bg-primary" : "bg-gray-300"}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

