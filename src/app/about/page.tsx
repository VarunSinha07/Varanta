"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { LightbulbIcon, Telescope, Shield, MessageSquare, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AnimatedBackground from "@/components/animated-background"

export default function AboutPage() {
  // State to handle client-side rendering
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render animations on client side
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32">Loading...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50 to-white"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100">
          <AnimatedBackground />
        </div>
        <div className="container mx-auto relative z-10 px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">About VarDaan Grow</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">Your Trusted Partner in Financial Success</p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Contact Us
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="mt-12 max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Image
              src="/VarDaanGrow-logo.png?height=400&width=800"
              alt="Bank Team"
              width={800}
              height={400}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Story
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The journey that made us who we are today.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 max-w-6xl mx-auto">
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-600 mb-6 mt-20 leading-relaxed">
                Founded in 2010, VarDaanGrow started with a simple mission: to make banking accessible, secure, and
                customer-focused. Over the years, we&apos;ve grown into a trusted financial institution serving millions of
                customers worldwide.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our state-of-the-art online banking platform allows you to manage your accounts, apply for loans, and
                track transactions with ease. We&apos;ve continuously evolved our services to meet the changing needs of our
                customers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we&apos;re proud to be one of the most innovative banks in the industry, combining cutting-edge
                technology with personalized service to provide an exceptional banking experience.
              </p>
            </motion.div>

            <motion.div
              className="relative border border-gray-100 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute top-0 bottom-0 left-10 w-0.5 bg-primary/20"></div>

              {/* Timeline Items */}
              <div className="space-y-10">
                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    2010
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Founded</h3>
                    <p className="text-gray-600">VarDaanGrow was established with a vision to transform banking.</p>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    2015
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Launched Online Banking</h3>
                    <p className="text-gray-600">Introduced our state-of-the-art digital banking platform.</p>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    2018
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Expanded Services</h3>
                    <p className="text-gray-600">Added comprehensive loan and investment products.</p>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    2020
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Reached 1M Customers</h3>
                    <p className="text-gray-600">Celebrated serving one million satisfied customers.</p>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    2023
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Global Expansion</h3>
                    <p className="text-gray-600">Extended our services to international markets.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Mission & Vision
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Guiding principles that drive everything we do.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-6 p-4 bg-primary/10 inline-block rounded-xl">
                <LightbulbIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower our customers with secure, simple, and innovative banking solutions that help them achieve
                their financial goals.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-6 p-4 bg-primary/10 inline-block rounded-xl">
                <Telescope className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading global bank, known for trust, transparency, and customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Core Values
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The principles that guide our actions and decisions.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Security</h3>
                <p className="text-gray-600">We prioritize the safety of your data with advanced encryption.</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Transparency</h3>
                <p className="text-gray-600">Clear and honest communication in all our services.</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Customer-Centric</h3>
                <p className="text-gray-600">Your needs drive everything we do.</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <Zap className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Innovation</h3>
                <p className="text-gray-600">We embrace technology to make banking better.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The people behind our success.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-4xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Jane Doe"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1 text-gray-900">Varun Sinha</h3>
                <p className="text-primary font-medium mb-4">Founder</p>
                <p className="text-gray-600">Leading with a vision for innovation and growth.</p>

                <div className="flex mt-6 space-x-3">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">Email</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="John Smith"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1 text-gray-900">Dishant Kaushik</h3>
                <p className="text-primary font-medium mb-4">Co-Founder</p>
                <p className="text-gray-600">Driving our technological advancement and digital transformation.</p>

                <div className="flex mt-6 space-x-3">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <span className="sr-only">Email</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}

