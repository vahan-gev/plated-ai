'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HomeHeroCarousel from '@/components/HomeHeroCarousel'
import HomeShowcaseGallery from '@/components/HomeShowcaseGallery'
import { CAROUSEL_SLIDES } from '@/data/homeCarousel'
import { SHOWCASE_PAIRS } from '@/data/homeShowcase'
import { Sparkles, Upload, Palette, Download, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function scrollToHowItWorks(e) {
  e.preventDefault()
  const el = document.getElementById('how-it-works')
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(null, '', '#how-it-works')
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-24 left-1/4 h-96 w-96 rounded-full bg-[#215E61]/6 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-[#215E61]/6 blur-3xl" />
        </div>

        <HomeHeroCarousel slides={CAROUSEL_SLIDES}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <h1 className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-5xl">
              Welcome to{' '}
              <span className="bg-linear-to-r from-white to-[#b8e0e2] bg-clip-text text-transparent">
                Plated.ai
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Create a brand that looks as good as your food tastes
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/generate"
                className="group inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-[#1d5458] hover:shadow-lg hover:shadow-black/30"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Start Generating
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how-it-works"
                scroll={false}
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/15"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </HomeHeroCarousel>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 px-4 py-24 sm:scroll-mt-28"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-3xl font-bold mb-4">
              Three Steps to <span className="gradient-text">Perfection</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              From your phone camera to a professional menu in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Palette className="w-5 h-5" />,
                title: 'Customize the Style',
                description: 'Choose lighting, color grading, surfaces, vessels, cutlery, and decorative accents for your perfect look.',
                step: '01',
              },
              {
                icon: <Upload className="w-5 h-5" />,
                title: 'Upload Your Dishes',
                description: 'Snap a photo of your food - even a simple phone shot works. Upload up to 20 images in one batch.',
                step: '02',
              },
              {
                icon: <Download className="w-5 h-5" />,
                title: 'Generate & Download',
                description: 'AI transforms your photos into polished menu images. Download the whole batch as a ZIP file.',
                step: '03',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative p-8 rounded-2xl border border-border bg-white shadow-sm hover:border-stone-300 transition-all hover:bg-muted/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-12 h-12 rounded-full bg-[#215E61]/10 flex items-center justify-center text-[#215E61] mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HomeShowcaseGallery pairs={SHOWCASE_PAIRS} />

      <footer className="border-t border-border py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              Plated<span className="gradient-text">.ai</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Vahan Gevorgyan • Sona Sargsyan
          </p>
        </div>
      </footer>
    </div>
  )
}
