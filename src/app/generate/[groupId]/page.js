'use client'

import { useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import DishConfigurator from '@/components/DishConfigurator'
import ConfirmDialog from '@/components/ConfirmDialog'
import {
  LIGHTING_OPTIONS,
  COLOR_GRADE_OPTIONS,
  SHOT_ANGLE_OPTIONS,
  buildPrompt,
} from '@/lib/constants'
import {
  Upload,
  Settings2,
  Sparkles,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ImageIcon,
  X,
  Eye,
  ArrowLeftRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function GroupPage({ params }) {
  const { groupId } = use(params)
  const router = useRouter()
  const group = useQuery(api.groups.getById, { groupId })
  const dishes = useQuery(api.dishes.listForGroup, { groupId })
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const createDish = useMutation(api.dishes.create)
  const removeDish = useMutation(api.dishes.remove)
  const updateGroup = useMutation(api.groups.update)
  const removeGroup = useMutation(api.groups.remove)

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [configureDish, setConfigureDish] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [viewDish, setViewDish] = useState(null)
  const [promptPreview, setPromptPreview] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return

    const currentCount = dishes?.length || 0
    const remaining = 20 - currentCount
    const filesToUpload = Array.from(files).slice(0, remaining)

    if (filesToUpload.length < files.length) {
      toast.warning(`Only ${remaining} more dishes can be added (max 20)`)
    }

    setIsUploading(true)
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        const uploadUrl = await generateUploadUrl()
        const result = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        const { storageId } = await result.json()
        await createDish({
          groupId,
          originalImageId: storageId,
          order: currentCount + i,
        })
      }
      toast.success(`${filesToUpload.length} dish${filesToUpload.length > 1 ? 'es' : ''} uploaded`)
    } catch (error) {
      toast.error('Failed to upload images')
    }
    setIsUploading(false)
  }, [dishes, groupId, generateUploadUrl, createDish])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload])

  const handleGenerateClick = () => {
    if (!dishes || dishes.length === 0) {
      toast.error('Upload at least one dish before generating')
      return
    }

    const unconfiguredDishes = dishes.filter(d => d.status === 'pending')
    const configuredDishes = dishes.filter(d => d.status === 'configured')

    if (unconfiguredDishes.length > 0) {
      toast.error(
        `${unconfiguredDishes.length} dish${unconfiguredDishes.length > 1 ? 'es are' : ' is'} not configured yet. Please click on each dish and configure its plate, cutlery, and decor before generating.`,
        { duration: 5000 }
      )
      return
    }

    if (configuredDishes.length === 0) {
      toast.error('No dishes ready to generate. Configure your dishes first.')
      return
    }

    const firstDish = configuredDishes[0]
    const prompt = buildPrompt({
      lighting: group.lighting,
      colorGrade: group.colorGrade,
      shotAngle: group.shotAngle,
      vesselImage: firstDish.vesselImage,
      surfaceImage: group.surfaceImage,
      cutleryPieces: firstDish.hasCutlery ? firstDish.cutleryPieces : null,
      cutleryStyleImage: firstDish.hasCutlery ? firstDish.cutleryStyleImage : null,
      decor: firstDish.decor,
      customNote: firstDish.customNote,
    })

    setPromptPreview({
      prompt,
      dishCount: configuredDishes.length,
      dishes: configuredDishes,
    })
  }

  const handleConfirmGenerate = async () => {
    const configuredDishes = promptPreview.dishes
    setPromptPreview(null)
    setIsGenerating(true)

    try {
      await updateGroup({ groupId, status: 'generating' })

      for (const dish of configuredDishes) {
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dishId: dish._id, groupId }),
          })

          if (!response.ok) {
            throw new Error('Generation failed')
          }
        } catch (err) {
          toast.error(`Failed to generate image for dish ${dish.order + 1}`)
        }
      }

      await updateGroup({ groupId, status: 'complete' })
      toast.success('All images generated!')
    } catch (error) {
      toast.error('Generation failed')
    }
    setIsGenerating(false)
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const res = await fetch(`/api/download?groupId=${groupId}`)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${group?.name || 'platedai'}-images.zip`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (err) {
      toast.error('Failed to download')
    }
    setIsDownloading(false)
  }

  const handleDownloadSingle = async (url, index) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${group?.name || 'dish'}-item-${index + 1}.png`
      a.click()
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      toast.error('Failed to download image')
    }
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    setDeleteLoading(true)
    try {
      if (pendingDelete.kind === 'group') {
        await removeGroup({ groupId })
        toast.success('Group deleted')
        setPendingDelete(null)
        router.push('/generate')
      } else {
        await removeDish({ dishId: pendingDelete.dishId })
        toast.success('Dish removed')
        setPendingDelete(null)
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 text-[#215E61] animate-spin" />
        </div>
      </div>
    )
  }

  const lightLabel = LIGHTING_OPTIONS.find(o => o.value === group.lighting)?.label
  const colorLabel = COLOR_GRADE_OPTIONS.find(o => o.value === group.colorGrade)?.label
  const angleLabel = SHOT_ANGLE_OPTIONS.find(o => o.value === group.shotAngle)?.label
  const completedDishes = dishes?.filter(d => d.status === 'complete') || []
  const unconfiguredCount = dishes?.filter(d => d.status === 'pending').length || 0
  const configuredCount = dishes?.filter(d => d.status === 'configured').length || 0
  const canGenerate = dishes && dishes.length > 0 && configuredCount > 0 && unconfiguredCount === 0
  const canDownload = completedDishes.length > 0

  const statusIcon = {
    pending: <div className="w-2 h-2 rounded-full bg-stone-400" />,
    configured: <div className="w-2 h-2 rounded-full bg-[#215E61]" />,
    generating: <Loader2 className="w-3.5 h-3.5 text-[#215E61] animate-spin" />,
    complete: <CheckCircle2 className="w-3.5 h-3.5 text-[#215E61]" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-[#D24545]" />,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-24 pb-16 px-4 sm:px-6 page-enter">
        <button
          type="button"
          onClick={() => router.push('/generate')}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          Back to Projects
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-3">{group.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-muted text-foreground">{lightLabel}</span>
              <span className="px-3 py-1 rounded-full bg-muted text-foreground">{colorLabel}</span>
              <span className="px-3 py-1 rounded-full bg-muted text-foreground">{angleLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {canDownload && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-stone-400 hover:text-stone-900 disabled:pointer-events-none disabled:border-[#dde3e9] disabled:bg-[#f1f4f7] disabled:text-[#8e96a3] disabled:opacity-100"
              >
                {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Download ZIP
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={!canGenerate || isGenerating}
              className="btn-primary-action inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#215E61]/18 transition-all hover:bg-[#1d5458]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate All
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setPendingDelete({ kind: 'group' })}
              className="inline-flex items-center justify-center rounded-full border border-border px-3 py-2 text-muted-foreground transition-all hover:border-[#D24545]/45 hover:bg-[#D24545]/12 hover:text-[#D24545]"
              title="Delete Group"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {unconfiguredCount > 0 && dishes && dishes.length > 0 && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-[#215E61]/10 border border-[#215E61]/25">
            <AlertCircle className="w-5 h-5 text-[#215E61] shrink-0" />
            <p className="text-sm text-[#233D4D]">
              <span className="font-semibold">{unconfiguredCount} dish{unconfiguredCount > 1 ? 'es' : ''}</span> still need to be configured. 
              Hover over each dish and click the <Settings2 className="w-3.5 h-3.5 inline" /> icon to set up plate, cutlery, and decor before generating.
            </p>
          </div>
        )}

        {(dishes?.length || 0) < 20 && (
          <div
            className={`upload-zone rounded-2xl p-8 mb-8 text-center cursor-pointer transition-all ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.multiple = true
              input.accept = 'image/*'
              input.onchange = (e) => handleFileUpload(e.target.files)
              input.click()
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-[#215E61] animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Upload className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag & drop dish photos here, or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  {dishes?.length || 0}/20 dishes · PNG, JPG, WEBP up to 10MB each
                </p>
              </div>
            )}
          </div>
        )}

        {dishes && dishes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {dishes.map((dish, i) => {
                const isComplete = dish.status === 'complete'
                const isGenerated = !!dish.generatedUrl

                return (
                  <motion.div
                    key={dish._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative rounded-xl border border-border bg-white/90 overflow-hidden hover:border-stone-300 transition-all"
                  >
                    <div
                      className={`aspect-square relative bg-muted ${isGenerated ? 'cursor-pointer' : ''}`}
                      onClick={() => isGenerated && setViewDish(dish)}
                    >
                      {dish.generatedUrl ? (
                        <Image
                          src={dish.generatedUrl}
                          alt={`Generated dish ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : dish.originalUrl ? (
                        <Image
                          src={dish.originalUrl}
                          alt={`Dish ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-8 h-8 text-stone-500" />
                        </div>
                      )}

                      {isGenerated && (
                        <div className="absolute top-2 left-2">
                          <Sparkles size={16} color="#ffffffBB"/>
                        </div>
                      )}

                      {isGenerated && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadSingle(dish.generatedUrl, i)
                            }}
                            className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            title="Download Image"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPendingDelete({ kind: 'dish', dishId: dish._id, dishNumber: i + 1 })
                            }}
                            className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-[#D24545]/35"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {!isGenerated && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setConfigureDish(dish)}
                            className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            title="Configure"
                          >
                            <Settings2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingDelete({ kind: 'dish', dishId: dish._id, dishNumber: i + 1 })
                            }
                            className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-[#D24545]/35"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dish {i + 1}</span>
                      <div className="flex items-center gap-1.5">
                        {statusIcon[dish.status]}
                        <span className="text-xs text-muted-foreground capitalize">{dish.status}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          !isUploading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Dishes Yet</h3>
              <p className="text-muted-foreground text-sm">Upload photos of your dishes above to get started.</p>
            </div>
          )
        )}
      </div>

      {configureDish && (
        <DishConfigurator
          dish={configureDish}
          onClose={() => setConfigureDish(null)}
          groupId={groupId}
        />
      )}

      {viewDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            data-app-modal-backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setViewDish(null)}
          />
          <motion.div
            className="relative w-full max-w-4xl bg-white border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-5 h-5 text-[#215E61]" />
                <h3 className="text-lg font-semibold">Compare — Dish {viewDish.order + 1}</h3>
              </div>
              <div className="flex items-center gap-2">
                {viewDish.generatedUrl && (
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(viewDish.generatedUrl, viewDish.order)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-stone-400 hover:text-stone-900"
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" />
                    Download
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewDish(null)}
                  className="inline-flex items-center justify-center rounded-full px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0">
              <div className="border-r border-border">
                <div className="px-4 py-2 bg-muted text-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original</span>
                </div>
                <div className="aspect-square relative bg-muted">
                  {viewDish.originalUrl && (
                    <Image
                      src={viewDish.originalUrl}
                      alt="Original dish"
                      fill
                      className="object-contain"
                      sizes="50vw"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 px-4 py-2 bg-muted text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#215E61]">
                    New
                  </span>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#215E61]" aria-hidden />
                </div>
                <div className="aspect-square relative bg-muted">
                  {viewDish.generatedUrl && (
                    <Image
                      src={viewDish.generatedUrl}
                      alt="Generated dish"
                      fill
                      className="object-contain"
                      sizes="50vw"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {promptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            data-app-modal-backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setPromptPreview(null)}
          />
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] bg-white border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div>
                <h3 className="text-lg font-semibold">Confirm Generation</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {promptPreview.dishCount} dish{promptPreview.dishCount > 1 ? 'es' : ''} will be generated
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPromptPreview(null)}
                className="inline-flex items-center justify-center rounded-full px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[#215E61] mb-2">Prompt (Dish 1 sample)</h4>
                <div className="p-4 rounded-xl bg-muted border border-stone-300 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
                  {promptPreview.prompt}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>• Each dish will receive a customized version of this prompt based on its individual configuration.</p>
                <p>• Reference images (dish photo, vessel, surface, cutlery) will be attached as inline images.</p>
                <p>• Model: <span className="text-muted-foreground">gemini-3.1-flash-image-preview</span></p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border p-5">
              <button
                type="button"
                onClick={() => setPromptPreview(null)}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-stone-300 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmGenerate}
                className="btn-primary-action inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#215E61]/18 transition-all hover:bg-[#1d5458]"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Confirm & Generate
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {pendingDelete && (
          <ConfirmDialog
            key={
              pendingDelete.kind === 'dish'
                ? `dish-${pendingDelete.dishId}`
                : 'group'
            }
            title={pendingDelete.kind === 'group' ? 'Delete this group?' : 'Remove this dish?'}
            message={
              pendingDelete.kind === 'group'
                ? `“${group.name}” and all of its dishes will be permanently deleted. This cannot be undone.`
                : `Dish ${pendingDelete.dishNumber} will be removed from this group. This cannot be undone.`
            }
            confirmLabel={pendingDelete.kind === 'group' ? 'Delete group' : 'Remove dish'}
            onCancel={() => {
              setPendingDelete(null)
              setDeleteLoading(false)
            }}
            onConfirm={handleConfirmDelete}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
