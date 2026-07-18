'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getCameraById, updateCamera } from '@/lib/cameras'
import { useAuth } from '@/hooks/useAuth'

const ZoneDrawer = dynamic(() => import('@/components/zone/ZoneDrawer'), { ssr: false })

const PLACEHOLDER_SNAPSHOT = '/snapshots/front-gate.jpg'

export default function ZonePage() {
  const { id } = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const isOwner = profile?.role === 'owner'

  const [camera, setCamera] = useState(null)
  const [pendingZone, setPendingZone] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const cam = await getCameraById(id)
        setCamera(cam)
        setPendingZone(cam.zone_polygon || null)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [id])

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateCamera(id, { zone_polygon: pendingZone })
      router.push(`/dashboard/cameras/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!camera) return <div className="p-6 text-zinc-400">Loading...</div>

  return (
    <div className="max-w-3xl flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Draw Restricted Zone</h1>
        <p className="text-zinc-400 mt-1">{camera.name} — draw a polygon over the area to watch.</p>
      </div>

      <ZoneDrawer
        imageUrl={PLACEHOLDER_SNAPSHOT}
        initialZone={camera.zone_polygon}
        onChange={setPendingZone}
        readOnly={!isOwner}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isOwner && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push(`/dashboard/cameras/${id}`)}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !pendingZone}
            className="bg-white text-zinc-950 font-medium text-sm px-4 py-2 rounded-lg hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Zone'}
          </button>
        </div>
      )}
    </div>
  )
}