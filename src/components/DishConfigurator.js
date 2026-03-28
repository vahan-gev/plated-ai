'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import StepWizard from './StepWizard'
import {
  VESSEL_OPTIONS,
  CUTLERY_PIECES,
  CUTLERY_STYLES,
  DECOR_CATEGORIES,
  getVesselImages,
} from '@/lib/constants'
import { X, Check, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const STEPS = ['Vessel', 'Cutlery', 'Decor', 'Notes']

export default function DishConfigurator({ dish, onClose }) {
  const updateDish = useMutation(api.dishes.update)

  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    vesselType: dish.vesselType || 'plate',
    vesselImage: dish.vesselImage || '',
    hasCutlery: dish.hasCutlery || false,
    cutleryPieces: dish.cutleryPieces || [],
    cutleryStyleImage: dish.cutleryStyleImage || '',
    decor: dish.decor || [],
    customNote: dish.customNote || '',
  })
  const [expandedCategory, setExpandedCategory] = useState(null)

  const vesselImages = getVesselImages(data.vesselType)

  const handleSave = async () => {
    try {
      await updateDish({
        dishId: dish._id,
        vesselType: data.vesselType,
        vesselImage: data.vesselImage,
        hasCutlery: data.hasCutlery,
        cutleryPieces: data.hasCutlery ? data.cutleryPieces : undefined,
        cutleryStyleImage: data.hasCutlery ? data.cutleryStyleImage : undefined,
        decor: data.decor,
        customNote: data.customNote,
        status: 'configured',
      })
      toast.success('Dish configured!')
      onClose()
    } catch (err) {
      toast.error('Failed to save configuration')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return data.vesselImage !== ''
      case 1: return !data.hasCutlery || (data.cutleryPieces.length > 0 && data.cutleryStyleImage !== '')
      case 2: return true
      case 3: return true
      default: return true
    }
  }

  const toggleCutleryPiece = (piece) => {
    setData(prev => ({
      ...prev,
      cutleryPieces: prev.cutleryPieces.includes(piece)
        ? prev.cutleryPieces.filter(p => p !== piece)
        : [...prev.cutleryPieces, piece],
    }))
  }

  const toggleDecor = (item) => {
    setData(prev => {
      if (prev.decor.includes(item)) {
        return { ...prev, decor: prev.decor.filter(d => d !== item) }
      }
      if (prev.decor.length >= 3) {
        toast.warning('Maximum 3 decor items')
        return prev
      }
      return { ...prev, decor: [...prev.decor, item] }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        data-app-modal-backdrop
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-border rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border bg-white/95 backdrop-blur-sm rounded-t-2xl">
          <h3 className="text-lg font-semibold">Configure Dish {dish.order + 1}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <StepWizard steps={STEPS} currentStep={step} onStepClick={(i) => i < step && setStep(i)} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Choose Vessel Type
                  </h4>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {VESSEL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setData({ ...data, vesselType: opt.value, vesselImage: '' })}
                        className={`option-card rounded-full border px-3 py-2 text-center text-xs font-medium ${
                          data.vesselType === opt.value ? 'selected' : 'border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Choose {VESSEL_OPTIONS.find(v => v.value === data.vesselType)?.label}
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {vesselImages.map(img => (
                      <button
                        key={img.value}
                        onClick={() => setData({ ...data, vesselImage: img.value })}
                        className={`option-card relative aspect-square overflow-hidden rounded-xl border ${
                          data.vesselImage === img.value ? 'selected ring-2 ring-[#215E61]' : 'border-border'
                        }`}
                      >
                        <Image src={img.src} alt={img.value} fill className="object-cover" sizes="100px" />
                        {data.vesselImage === img.value && (
                          <div className="absolute inset-0 bg-[#215E61]/22 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Include Cutlery?
                  </h4>
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setData({ ...data, hasCutlery: false })}
                      className={`option-card flex-1 rounded-full border px-3 py-2 text-center text-xs font-medium ${
                        !data.hasCutlery ? 'selected' : 'border-border'
                      }`}
                    >
                      No Cutlery
                    </button>
                    <button
                      onClick={() => setData({ ...data, hasCutlery: true })}
                      className={`option-card flex-1 rounded-full border px-3 py-2 text-center text-xs font-medium ${
                        data.hasCutlery ? 'selected' : 'border-border'
                      }`}
                    >
                      Yes, Add Cutlery
                    </button>
                  </div>

                  {data.hasCutlery && (
                    <>
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Select Pieces
                      </h4>
                      <div className="flex gap-2 mb-6">
                        {CUTLERY_PIECES.map(p => (
                          <button
                            key={p.value}
                            onClick={() => toggleCutleryPiece(p.value)}
                            className={`option-card flex-1 rounded-full border px-3 py-2 text-center text-xs font-medium ${
                              data.cutleryPieces.includes(p.value) ? 'selected' : 'border-border'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Choose Cutlery Style
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {CUTLERY_STYLES.map(style => (
                          <button
                            key={style.value}
                            onClick={() => setData({ ...data, cutleryStyleImage: style.value })}
                            className={`option-card relative aspect-square overflow-hidden rounded-xl border ${
                              data.cutleryStyleImage === style.value ? 'selected ring-2 ring-[#215E61]' : 'border-border'
                            }`}
                          >
                            <Image src={style.src} alt={style.value} fill className="object-cover" sizes="80px" />
                            {data.cutleryStyleImage === style.value && (
                              <div className="absolute inset-0 bg-[#215E61]/22 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Decorative Accents
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Choose up to 3 items (optional)
                      </p>
                    </div>
                    {data.decor.length > 0 && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#215E61]/10 text-[#215E61]">
                        {data.decor.length}/3 selected
                      </span>
                    )}
                  </div>

                  {data.decor.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {data.decor.map(item => (
                        <span
                          key={item}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#215E61]/10 text-[#215E61] text-sm border border-[#215E61]/25"
                        >
                          {item}
                          <button onClick={() => toggleDecor(item)} className="hover:text-[#233D4D]">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {DECOR_CATEGORIES.map((cat, ci) => (
                      <div key={ci} className="overflow-hidden rounded-xl border border-border">
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(expandedCategory === ci ? null : ci)}
                          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          {cat.name}
                          {expandedCategory === ci ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        {expandedCategory === ci && (
                          <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
                            {cat.items.map(item => (
                              <button
                                key={item}
                                onClick={() => toggleDecor(item)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                  data.decor.includes(item)
                                    ? 'border-[#215E61]/35 bg-[#215E61]/10 text-[#215E61]'
                                    : 'border-stone-300 text-muted-foreground hover:border-stone-400 hover:text-foreground'
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Custom Note (Optional)
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Add any additional directions not covered by the options above.
                  </p>
                  <textarea
                    value={data.customNote}
                    onChange={(e) => setData({ ...data, customNote: e.target.value })}
                    placeholder="e.g. Make the dish appear steaming hot, add a slight tilt to the plate..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#215E61] focus:ring-2 focus:ring-[#215E61]/20 transition-all resize-none shadow-sm"
                  />

                  <div className="mt-6 p-4 rounded-xl bg-muted/80 border border-border">
                    <h5 className="text-sm font-semibold text-foreground mb-3">Configuration Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vessel</span>
                        <span className="text-foreground">{data.vesselType} — {data.vesselImage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cutlery</span>
                        <span className="text-foreground">{data.hasCutlery ? data.cutleryPieces.join(', ') : 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Decor</span>
                        <span className="text-foreground text-right max-w-[200px]">{data.decor.length > 0 ? data.decor.join(', ') : 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
            <button
              type="button"
              onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-stone-300 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              {step === 0 ? 'Cancel' : 'Back'}
            </button>

            {step === STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#215E61]/18 transition-all hover:bg-[#1d5458]"
              >
                <Check className="h-3.5 w-3.5 shrink-0" />
                Save Configuration
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary-action inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#215E61]/18 transition-all hover:bg-[#1d5458] disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
