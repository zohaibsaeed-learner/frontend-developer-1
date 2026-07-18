'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCameraById, updateCamera, deleteCamera } from '@/lib/cameras'
import { useAuth } from '@/hooks/useAuth'

export default function CameraDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const isOwner = profile?.role === 'owner'

  const [camera, setCamera] = useState(null)
  const [name, setName] = useState('')
  const [rtspUrl, setRtspUrl] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const cam = await getCameraById(id)
        setCamera(cam)
        setName(cam.name)
        setRtspUrl(cam.rtsp_url)
        setLatitude(cam.latitude ?? '')
        setLongitude(cam.longitude ?? '')
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [id])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateCamera(id, {
        name,
        rtsp_url: rtspUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      })
      router.push('/dashboard/cameras')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteCamera(id)
      router.push('/dashboard/cameras')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!camera) return <div className="p-6 text-zinc-400">Loading...</div>

  return (
    <div className="max-w-md flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Edit Camera</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-4 p-6 rounded-xl border border-zinc-900 bg-zinc-900/40">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={!isOwner}
            className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">RTSP URL</label>
          <input value={rtspUrl} onChange={(e) => setRtspUrl(e.target.value)} disabled={!isOwner}
            className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">Latitude</label>
          <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} disabled={!isOwner}
            className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400">Longitude</label>
          <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} disabled={!isOwner}
            className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" />
        </div>

        <a
          href={`/dashboard/cameras/${id}/zone`}
          className="text-sm text-blue-400 hover:text-blue-300 text-center"
        >
          Draw / Edit Restricted Zone →
        </a>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {isOwner && (
          <div className="flex justify-between mt-2">
            <button type="button" onClick={handleDelete} className="text-sm text-red-400 hover:text-red-300">
              Delete Camera
            </button>
            <button type="submit" disabled={saving} className="bg-white text-zinc-950 font-medium text-sm px-4 py-2 rounded-lg hover:bg-zinc-200 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}