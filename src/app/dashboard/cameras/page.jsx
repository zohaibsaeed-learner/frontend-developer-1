'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks/useAuth'
import { getCameras, addCamera, deleteCamera } from '@/lib/cameras'

const CameraMap = dynamic(() => import('@/components/cameras/CameraMap'), { ssr: false })

export default function CameraManagement() {
  const { user, profile } = useAuth()
  const isOwner = profile?.role === 'owner'

  const [cameras, setCameras] = useState([])
  const [name, setName] = useState('')
  const [rtspUrl, setRtspUrl] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function validateRtsp(url) {
    return /^rtsp:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/.test(url)
  }

  useEffect(() => {
    async function load() {
      try {
        setCameras(await getCameras())
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  async function handleAddCamera(e) {
    e.preventDefault()
    setError('')
    if (!validateRtsp(rtspUrl)) {
      setError('Invalid RTSP URL. Format must start with rtsp://')
      return
    }
    setLoading(true)
    try {
      const newCamera = await addCamera({
        ownerId: user.id,
        name,
        rtspUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      })
      setCameras([newCamera, ...cameras])
      setName(''); setRtspUrl(''); setLatitude(''); setLongitude('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCamera(id)
      setCameras(cameras.filter((c) => c.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Camera Management</h1>
        <p className="text-zinc-400 mt-1">
          {isOwner ? 'Register and configure your local hardware RTSP streams.' : 'Viewing cameras (read-only)'}
        </p>
      </div>

      {cameras.length > 0 && <CameraMap cameras={cameras} />}

      {isOwner && (
        <form onSubmit={handleAddCamera} className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/40 backdrop-blur-md flex flex-col gap-4">
          <h2 className="text-lg font-medium text-white">Add New Camera</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">Camera Name</label>
              <input type="text" placeholder="e.g., Front Gate Camera" value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-700" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">RTSP Stream URL</label>
              <input type="text" placeholder="rtsp://admin:password@192.168.1.100:554/stream1" value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-700" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">Latitude</label>
              <input type="number" step="any" placeholder="33.6844" value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-700" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400">Longitude</label>
              <input type="number" step="any" placeholder="73.0479" value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-700" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="self-end bg-white text-zinc-950 font-medium text-sm px-4 py-2 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
            {loading ? 'Adding...' : 'Add Camera'}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-medium text-white">Configured Feeds ({cameras.length})</h2>
        {cameras.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No cameras registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {cameras.map((cam) => (
              <Link key={cam.id} href={`/dashboard/cameras/${cam.id}`}
                className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 flex justify-between items-center hover:border-zinc-700 transition">
                <div>
                  <h4 className="font-medium text-white">{cam.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{cam.rtsp_url}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cam.status || 'offline'}
                  </span>
                  {isOwner && (
                    <button onClick={(e) => { e.preventDefault(); handleDelete(cam.id) }}
                      className="text-xs text-red-400 hover:text-red-300">
                      Delete
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}