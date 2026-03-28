'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import StepWizard from '@/components/StepWizard'
import {
  LIGHTING_OPTIONS,
  COLOR_GRADE_OPTIONS,
  SHOT_ANGLE_OPTIONS,
  SURFACE_IMAGE_LIST,
} from '@/lib/constants'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const STEPS = ['Name', 'Lighting', 'Color Grade', 'Surface', 'Shot Angle']

export default function NewGroupPage() {
  const router = useRouter()
  const createGroup = useMutation(api.groups.create)

  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    lighting: '',
    colorGrade: '',
    surfaceImage: '',
    shotAngle: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  const canProceed = () => {
    switch (step) {
      case 0: return data.name.trim().length > 0
      case 1: return data.lighting !== ''
      case 2: return data.colorGrade !== ''
      case 3: return data.surfaceImage !== ''
      case 4: return data.shotAngle !== ''
      default: return false
    }
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setIsCreating(true)
      try {
        const groupId = await createGroup({
          name: data.name.trim(),
          lighting: data.lighting,
          colorGrade: data.colorGrade,
          shotAngle: data.shotAngle,
          surfaceImage: data.surfaceImage,
        })
        toast.success('Group created successfully!')
        router.push(`/generate/${groupId}`)
      } catch (err) {
        toast.error('Failed to create group')
        setIsCreating(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
    else router.push('/generate')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-24 pb-16 px-4 sm:px-6">
        <StepWizard
          steps={STEPS}
          currentStep={step}
          onStepClick={(i) => {
            if (i < step) setStep(i)
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="min-h-[400px]"
          >
            {step === 0 && (
              <div className="max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-bold mb-2">Name Your Group</h2>
                <p className="text-muted-foreground mb-8">
                  Give this batch a descriptive name, like "Lunch Menu" or "Summer Desserts".
                </p>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="e.g. Spring Dinner Menu"
                  className="w-full px-5 py-4 bg-white border border-border rounded-xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#215E61] focus:ring-2 focus:ring-[#215E61]/20 transition-all shadow-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Lighting</h2>
                  <p className="text-muted-foreground">
                    Select the lighting style for all dishes in this group.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {LIGHTING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setData({ ...data, lighting: opt.value })}
                      className={`option-card p-5 rounded-xl border text-left transition-all ${
                        data.lighting === opt.value ? 'selected' : 'border-border'
                      }`}
                    >
                      <span className="text-2xl mb-3 block">{opt.icon}</span>
                      <h4 className="font-semibold mb-1">{opt.label}</h4>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Color Grade</h2>
                  <p className="text-muted-foreground">
                    Select the color grading style for your photos.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {COLOR_GRADE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setData({ ...data, colorGrade: opt.value })}
                      className={`option-card p-5 rounded-xl border text-left transition-all ${
                        data.colorGrade === opt.value ? 'selected' : 'border-border'
                      }`}
                    >
                      <h4 className="font-semibold mb-1">{opt.label}</h4>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Surface</h2>
                  <p className="text-muted-foreground">
                    Select the tablecloth or surface your dishes will sit on.
                  </p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                  {SURFACE_IMAGE_LIST.map((name) => (
                    <button
                      key={name}
                      onClick={() => setData({ ...data, surfaceImage: name })}
                      className={`option-card rounded-xl overflow-hidden border aspect-square relative ${
                        data.surfaceImage === name ? 'selected ring-2 ring-[#215E61]' : 'border-border'
                      }`}
                    >
                      <Image
                        src={`/assets/tablecloths/${name}.jpeg`}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                      {data.surfaceImage === name && (
                        <div className="absolute inset-0 bg-[#215E61]/22 flex items-center justify-center">
                          <Check className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Shot Angle</h2>
                  <p className="text-muted-foreground">
                    Select the camera angle for your menu photos.
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
                  {SHOT_ANGLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setData({ ...data, shotAngle: opt.value })}
                      className={`option-card p-6 rounded-xl border text-center transition-all ${
                        data.shotAngle === opt.value ? 'selected' : 'border-border'
                      }`}
                    >
                      <span className="text-4xl mb-3 block">{opt.icon}</span>
                      <h4 className="font-semibold mb-1">{opt.label}</h4>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-stone-300 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed() || isCreating}
            className="btn-primary-action inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#215E61]/18 transition-all hover:bg-[#1d5458] disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Sparkles className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                Creating…
              </>
            ) : step === STEPS.length - 1 ? (
              <>
                <Check className="h-3.5 w-3.5 shrink-0" />
                Create Group
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
