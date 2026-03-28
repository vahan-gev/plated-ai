import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../convex/_generated/api'
import { buildPrompt } from '@/lib/constants'

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { dishId, groupId } = await request.json()
    const reqUrl = new URL(request.url)
    const origin = reqUrl.origin

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'REPLACE_ME_WITH_YOUR_GEMINI_API_KEY') {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const group = await convex.query(api.groups.getById, { groupId })
    const dishes = await convex.query(api.dishes.listForGroup, { groupId })
    const dish = dishes.find(d => d._id === dishId)

    if (!group || !dish) {
      return NextResponse.json({ error: 'Group or dish not found' }, { status: 404 })
    }

    await convex.mutation(api.dishes.update, {
      dishId,
      status: 'generating',
    })

    const prompt = buildPrompt({
      lighting: group.lighting,
      colorGrade: group.colorGrade,
      shotAngle: group.shotAngle,
      vesselImage: dish.vesselImage,
      surfaceImage: group.surfaceImage,
      cutleryPieces: dish.hasCutlery ? dish.cutleryPieces : null,
      cutleryStyleImage: dish.hasCutlery ? dish.cutleryStyleImage : null,
      decor: dish.decor,
      customNote: dish.customNote,
      aspectRatio: group.aspectRatio,
    })

    const parts = [{ text: prompt }]

    if (dish.originalUrl) {
      const imgResponse = await fetch(dish.originalUrl)
      const imgBuffer = await imgResponse.arrayBuffer()
      const base64 = Buffer.from(imgBuffer).toString('base64')
      const mimeType = imgResponse.headers.get('content-type') || 'image/jpeg'

      parts.push({
        inlineData: { mimeType, data: base64 },
      })
    }

    if (dish.vesselImage) {
      const vesselPath = getAssetPath('vessel', dish.vesselType, dish.vesselImage)
      if (vesselPath) {
        try {
          const imgResponse = await fetch(`${origin}${vesselPath}`)
          if (imgResponse.ok) {
            const imgBuffer = await imgResponse.arrayBuffer()
            const base64 = Buffer.from(imgBuffer).toString('base64')
            parts.push({
              inlineData: { mimeType: 'image/jpeg', data: base64 },
            })
          }
        } catch (e) {
          console.error("Vessel fetch error:", e)
        }
      }
    }

    if (group.surfaceImage) {
      const surfacePath = `/assets/tablecloths/${group.surfaceImage}.jpeg`
      try {
        const imgResponse = await fetch(`${origin}${surfacePath}`)
        if (imgResponse.ok) {
          const imgBuffer = await imgResponse.arrayBuffer()
          const base64 = Buffer.from(imgBuffer).toString('base64')
          parts.push({
            inlineData: { mimeType: 'image/jpeg', data: base64 },
          })
        }
      } catch (e) {
        console.error("Surface fetch error:", e)
      }
    }

    if (dish.hasCutlery && dish.cutleryStyleImage) {
      const cutleryPath = `/assets/cutleries/${dish.cutleryStyleImage}.jpeg`
      try {
        const imgResponse = await fetch(`${origin}${cutleryPath}`)
        if (imgResponse.ok) {
          const imgBuffer = await imgResponse.arrayBuffer()
          const base64 = Buffer.from(imgBuffer).toString('base64')
          parts.push({
            inlineData: { mimeType: 'image/jpeg', data: base64 },
          })
        }
      } catch (e) {
        console.error("Cutlery fetch error:", e)
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [{ role: 'user', parts }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    })

    let generatedImageData = null
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        generatedImageData = part.inlineData
        break
      }
    }

    if (!generatedImageData) {
      await convex.mutation(api.dishes.update, { dishId, status: 'error' })
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      )
    }

    const uploadUrl = await convex.mutation(api.storage.generateUploadUrl)
    const imageBuffer = Buffer.from(generatedImageData.data, 'base64')
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': generatedImageData.mimeType || 'image/png' },
      body: imageBuffer,
    })
    const { storageId } = await uploadRes.json()

    await convex.mutation(api.dishes.setGeneratedImage, {
      dishId,
      generatedImageId: storageId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}

function getAssetPath(type, vesselType, value) {
  if (type === 'vessel') {
    if (value.startsWith('plate')) return `/assets/plates/${value}.jpeg`
    if (value.startsWith('bowl')) return `/assets/plates/${value}.jpeg`
    if (value.startsWith('board')) return `/assets/plates/${value}.jpeg`
    if (value.startsWith('cup') || value.startsWith('glass')) return `/assets/cups/${value}.jpeg`
  }
  return null
}
