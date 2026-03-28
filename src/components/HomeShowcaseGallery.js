'use client'

import Image from 'next/image'

export default function HomeShowcaseGallery({ pairs }) {
  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-3xl">
            <span className="gradient-text">Examples</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {pairs.map((pair) => (
            <div
              key={pair.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
            >
              <Image
                src={pair.generated}
                alt=""
                fill
                className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <Image
                src={pair.original}
                alt=""
                fill
                className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                Original
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
