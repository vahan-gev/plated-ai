import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import { ConvexHttpClient } from 'convex/browser'
import { auth } from '@clerk/nextjs/server'
import { api } from '../../../../convex/_generated/api'

export async function GET(request) {
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
    const { getToken } = await auth()
    const token = await getToken({ template: 'convex' })
    if (token) convex.setAuth(token)

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    if (!groupId) {
      return NextResponse.json({ error: 'Missing groupId' }, { status: 400 })
    }

    const group = await convex.query(api.groups.getById, { groupId })
    const dishes = await convex.query(api.dishes.listForGroup, { groupId })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    const completedDishes = dishes.filter(d => d.status === 'complete' && d.generatedUrl)

    if (completedDishes.length === 0) {
      return NextResponse.json({ error: 'No generated images to download' }, { status: 400 })
    }

    const zip = new JSZip()

    for (let i = 0; i < completedDishes.length; i++) {
      const dish = completedDishes[i]
      if (dish.generatedUrl) {
        try {
          const imgResponse = await fetch(dish.generatedUrl)
          const imgBuffer = await imgResponse.arrayBuffer()
          const extension = dish.generatedUrl.includes('.png') ? 'png' : 'jpg'
          zip.file(`item${i + 1}.${extension}`, imgBuffer)
        } catch (e) {
        }
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${group.name}-images.zip"`,
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: error.message || 'Download failed' },
      { status: 500 }
    )
  }
}
