'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function StepWizard({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-border z-0" />
        <motion.div
          className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-[#215E61] to-[#2a7378] z-[1]"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10 cursor-pointer group"
              onClick={() => isCompleted && onStepClick?.(index)}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-[#215E61] text-white shadow-lg shadow-[#215E61]/30'
                    : isActive
                    ? 'bg-[#215E61] text-white ring-4 ring-[#215E61]/20 shadow-lg shadow-[#215E61]/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </motion.div>

              <span
                className={`mt-2.5 text-xs font-medium text-center max-w-[80px] leading-tight transition-colors ${
                  isActive
                    ? 'text-[#215E61]'
                    : isCompleted
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
