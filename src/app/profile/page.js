'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Crown, FolderOpen, Clock, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDeviceId } from '@/hooks/useDeviceId'

export default function ProfilePage() {
  const deviceId = useDeviceId()
  const getOrCreateUser = useMutation(api.users.getOrCreateUser)
  const convexUser = useQuery(api.users.getCurrentUser, deviceId ? { deviceId } : 'skip')
  const groups = useQuery(api.groups.listForUser, deviceId ? { deviceId } : 'skip')

  useEffect(() => {
    if (deviceId) {
      getOrCreateUser({ deviceId })
    }
  }, [deviceId, getOrCreateUser])

  if (!deviceId || !convexUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin text-[#215E61]" />
        </div>
      </div>
    )
  }

  const totalDishes = groups?.reduce((acc, g) => acc + g.dishCount, 0) || 0
  const completedGroups = groups?.filter(g => g.status === 'complete').length || 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 sm:px-6 page-enter">
        <motion.div
          className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-4 sm:gap-6">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-linear-to-br from-[#215E61] to-[#233D4D] text-2xl font-bold text-white shadow-md shadow-[#215E61]/18 flex items-center justify-center overflow-hidden">
              {convexUser?.displayName?.[0]?.toUpperCase() || '?'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold">
                    {convexUser?.displayName || 'User'}
                  </h1>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#215E61]/25 bg-[#215E61]/10 px-3 py-1">
                    <Crown className="h-3.5 w-3.5 text-[#215E61]" />
                    <span className="text-xs font-medium capitalize text-[#215E61]">
                      {convexUser?.plan || 'free'} Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{groups?.length || 0}</div>
              <div className="mt-1 text-xs text-muted-foreground">Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalDishes}</div>
              <div className="mt-1 text-xs text-muted-foreground">Total Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#215E61]">{completedGroups}</div>
              <div className="mt-1 text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </motion.div>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Groups</h2>
            <Link
              href="/generate/new"
              className="flex items-center gap-2 rounded-full border border-[#215E61]/30 px-3 py-2 text-xs font-medium text-[#215E61] transition-all hover:border-[#215E61]/45"
            >
              <Sparkles className="h-3.5 w-3.5" />
              New Group
            </Link>
          </div>

          {groups === undefined ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-18 rounded-xl border border-border bg-muted shimmer" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/50 py-12 text-center">
              <FolderOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No groups yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group, i) => (
                <motion.div
                  key={group._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/generate/${group._id}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-3 shadow-sm transition-all hover:border-stone-300 hover:bg-muted/40 sm:p-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                        {group.previewUrl ? (
                          <Image
                            src={group.previewUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold transition-colors group-hover:text-[#215E61]">
                          {group.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {group.dishCount} dishes · {new Date(group.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        group.status === 'complete' ? 'bg-[#215E61]/15 text-[#215E61]' :
                        group.status === 'generating' ? 'bg-[#215E61]/15 text-[#215E61]' :
                        'bg-stone-200/80 text-stone-600'
                      }`}>
                        {group.status === 'complete' ? <CheckCircle2 className="h-3 w-3" /> :
                         group.status === 'generating' ? <Loader2 className="h-3 w-3 animate-spin" /> :
                         <Clock className="h-3 w-3" />}
                        {group.status}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
