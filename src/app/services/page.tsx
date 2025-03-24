"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { Wallet, DollarSign, CreditCard, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CtaBanner from "@/components/cta-banner"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100"></div>
          <BackgroundAnimation />
        </div>
        <div className="container mx-auto relative z-10 px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Explore Our Banking Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              From accounts to loans, we&apos;ve got all your financial needs covered.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Get Started Today
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Financial Dashboard"
              width={800}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedHeader
            title="Our Services"
            subtitle="Comprehensive banking solutions designed to meet all your financial needs."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-16">
            <ServiceCard
              icon={<Wallet className="h-12 w-12 text-primary" />}
              title="Manage Your Accounts"
              description="Open and manage savings, checking, or business accounts with ease. Check your balance, account type, and status anytime. Enjoy competitive interest rates and seamless access to your funds."
              ctaText="View Accounts"
              ctaLink="/services/accounts"
              delay={0.1}
            />

            <ServiceCard
              icon={<DollarSign className="h-12 w-12 text-primary" />}
              title="Apply for a Loan"
              description="Need funds for a big purchase or emergency? Apply for a personal or business loan with competitive interest rates and flexible repayment durations. Track your loan status in real-time."
              ctaText="Apply for a Loan"
              ctaLink="/services/loans"
              delay={0.2}
            />

            <ServiceCard
              icon={<CreditCard className="h-12 w-12 text-primary" />}
              title="Manage Your Cards"
              description="Issue and manage debit or credit cards securely. View your card details, including card number, type, and expiry date. Block a card instantly if lost or stolen."
              ctaText="Manage Cards"
              ctaLink="/services/cards"
              delay={0.3}
            />

            <ServiceCard
              icon={<Clock className="h-12 w-12 text-primary" />}
              title="Track Your Transactions"
              description="Monitor every deposit, withdrawal, and transfer with a detailed transaction history. View transaction dates, amounts, and types to stay on top of your spending."
              ctaText="View Transactions"
              ctaLink="/services/transactions"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedHeader
            title="Why Choose Varanta ?"
            subtitle="Experience the benefits of our comprehensive banking solutions."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
            <AnimatedFeature
              number="01"
              title="Security First"
              description="Your financial data is protected with state-of-the-art encryption and security protocols."
              delay={0.1}
            />

            <AnimatedFeature
              number="02"
              title="24/7 Access"
              description="Manage your finances anytime, anywhere with our secure online banking platform."
              delay={0.2}
            />

            <AnimatedFeature
              number="03"
              title="Personalized Support"
              description="Our dedicated team is always ready to assist you with any banking needs."
              delay={0.3}
            />

            <AnimatedFeature
              number="04"
              title="Competitive Rates"
              description="Enjoy some of the best interest rates and lowest fees in the industry."
              delay={0.4}
            />

            <AnimatedFeature
              number="05"
              title="Easy Applications"
              description="Apply for accounts, loans, and cards with our streamlined application process."
              delay={0.5}
            />

            <AnimatedFeature
              number="06"
              title="Financial Tools"
              description="Access budgeting tools and financial calculators to help you plan your future."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner />

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Background Animation Component
function BackgroundAnimation() {
  return (
    <div className="absolute inset-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: Math.random() * 300 + 50,
            height: Math.random() * 300 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
            scale: [1, Math.random() * 0.2 + 0.9],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Animated Header Component
function AnimatedHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="text-center max-w-3xl mx-auto"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </motion.div>
  )
}

// Service Card Component
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  delay: number;
}

function ServiceCard({ icon, title, description, ctaText, ctaLink, delay }: ServiceCardProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-300"
    >
      <div className="mb-6 p-4 bg-primary/10 inline-block rounded-xl">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <Link href={ctaLink} className="inline-flex items-center text-primary font-medium hover:underline group">
        {ctaText}
        <svg
          className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </motion.div>
  )
}

// Animated Feature Component
interface AnimatedFeatureProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

function AnimatedFeature({ number, title, description, delay }: AnimatedFeatureProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="text-4xl font-bold text-primary/20 mb-4">{number}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

