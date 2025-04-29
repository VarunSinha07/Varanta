"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Wallet, DollarSign, CreditCard, Clock, Lock, Headphones, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

import CtaBanner from "@/components/cta-banner"
import AnimatedBackground from "@/components/animated-background"
import TestimonialCarousel from "@/components/testimonial-carousel"
import FeatureCard from "@/components/feature-card"
import ServiceItem from "@/components/service-item"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100"></div>
          <AnimatedBackground />
        </div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Manage Your Finances with Ease!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Secure, Simple, and Smart Banking – All in One Place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                  Login to Your Account
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-green-500 text-green-500 hover:bg-green-50"
                >
                  Open a New Account
                </Button>
              </motion.div>
            </div>
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">Trusted by Millions</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Image
              src="/home.png?height=400&width=800"
              alt="Banking App Interface"
              width={800}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience banking that puts you first with our comprehensive suite of services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-primary" />}
              title="View Account Balance"
              description="Check your account balance, type, and status anytime, anywhere."
              ctaText="Explore Accounts"
              ctaLink="/services/accounts"
              delay={0.1}
            />
            <FeatureCard
              icon={<DollarSign className="h-10 w-10 text-primary" />}
              title="Apply for a Loan"
              description="Need funds? Apply for a loan with competitive interest rates."
              ctaText="Apply Now"
              ctaLink="/services/loans"
              delay={0.2}
            />
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-primary" />}
              title="Manage Cards"
              description="View and manage your debit/credit cards with ease."
              ctaText="Manage Cards"
              ctaLink="/services/cards"
              delay={0.3}
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Track Transactions"
              description="Monitor your spending with detailed transaction history."
              ctaText="View Transactions"
              ctaLink="/services/transactions"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our customers have to say.
            </p>
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive banking solutions designed to meet all your financial needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ServiceItem
              title="Accounts"
              description="Open and manage savings, checking, or business accounts with competitive interest rates."
              delay={0.1}
            />
            <ServiceItem
              title="Loans"
              description="Get quick access to personal or business loans with flexible repayment options."
              delay={0.2}
            />
            <ServiceItem
              title="Cards"
              description="Issue and manage debit/credit cards for secure payments."
              delay={0.3}
            />
            <ServiceItem
              title="Transactions"
              description="Track every deposit, withdrawal, and transfer in real-time."
              delay={0.4}
            />
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Learn More About Our Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner />

    </div>
  )
}

