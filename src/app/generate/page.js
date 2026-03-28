'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Plus, FolderOpen, Sparkles, Clock, CheckCircle2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDeviceId } from '@/hooks/useDeviceId'

export default function GeneratePage() {
  const deviceId = useDeviceId()
  const router = useRouter()
  const getOrCreateUser = useMutation(api.users.getOrCreateUser)
  
  const groups = useQuery(
    api.groups.listForUser,
    deviceId ? { deviceId } : 'skip'
  )

  useEffect(() => {
    if (deviceId) {
      getOrCreateUser({ deviceId })
    }
  }, [deviceId, getOrCreateUser])

  if (!deviceId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 text-[#215E61] animate-spin" />
        </div>
      </div>
    )
  }

  const statusColors = {
    draft: 'text-stone-600 bg-stone-200/80',
    generating: 'text-[#215E61] bg-[#215E61]/15',
    complete: 'text-[#215E61] bg-[#215E61]/15',
  }

  const statusIcons = {
    draft: <Clock className="w-3.5 h-3.5" />,
    generating: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    complete: <CheckCircle2 className="w-3.5 h-3.5" />,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-24 pb-12 px-4 sm:px-6 page-enter">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Your Projects</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage your menu photography batches.
            </p>
          </div>
          <Link
            href="/generate/new"
            className="inline-flex items-center gap-1 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-md shadow-[#215E61]/18 transition-all hover:bg-[#1d5458] hover:shadow-[#215E61]/22"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            New Group
          </Link>
        </div>

        {groups === undefined ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-muted border border-border shimmer" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6 border border-border">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Create your first group to start generating stunning menu photographs.
            </p>
            <Link
              href="/generate/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#215E61] px-3 py-2 text-xs font-semibold text-white shadow-md shadow-[#215E61]/18 transition-all hover:bg-[#1d5458]"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              Create First Group
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/generate/new"
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-[#215E61]/45 hover:bg-[#215E61]/6 transition-all min-h-[160px] group"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted transition-colors group-hover:bg-[#215E61]/10">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-[#215E61] transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-[#215E61] transition-colors">
                New Group
              </span>
            </Link>

            {groups.map((group, i) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/generate/${group._id}`}
                  className="block p-6 rounded-2xl border border-border bg-white shadow-sm hover:border-stone-300 hover:bg-muted/40 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold group-hover:text-[#215E61] transition-colors truncate pr-4">
                      {group.name}
                    </h3>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusColors[group.status]}`}>
                      {statusIcons[group.status]}
                      {group.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{group.dishCount} {group.dishCount === 1 ? '/ 20 dish' : '/ 20 dishes'}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    Created on {new Date(group.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
