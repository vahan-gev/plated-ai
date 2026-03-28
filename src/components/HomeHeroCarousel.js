'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const INTERVAL_MS = 5500

export default function HomeHeroCarousel({ slides, children }) {
  const [index, setIndex] = useState(0)
  const n = slides.length

  const go = useCallback(
    (dir) => {
      if (n <= 0) return
      setIndex((i) => (i + dir + n) % n)
    },
    [n]
  )

  useEffect(() => {
    if (n <= 1) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % n), INTERVAL_MS)
    return () => clearInterval(id)
  }, [n])

  const current = n > 0 ? slides[index] : null

  if (!current) {
    return (
      <section className="relative w-full">
        <div className="relative flex min-h-[320px] items-end justify-center bg-muted p-6 sm:min-h-[380px] md:min-h-[420px]">
          <div className="relative z-10 mx-auto w-full max-w-3xl pb-8 text-center sm:pb-10 md:pb-12">
            {children}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative aspect-[16/10] min-h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-lg sm:aspect-[2/1] sm:min-h-[380px] md:min-h-[420px]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#233d4d]/90 via-[#233d4d]/35 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pb-8 sm:p-10 sm:pb-10 md:pb-12">
          <div className="mx-auto w-full max-w-3xl text-center">
            {children}
            {n > 1 && (
              <div className="mt-8 flex justify-center gap-1.5">
                {slides.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-4"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-4"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
