'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'next/navigation'

// Leaflet's default marker icons break under bundlers — point them at the CDN instead
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function CameraMap({ cameras }) {
  const router = useRouter()
  const withCoords = cameras.filter((c) => c.latitude && c.longitude)
  const center = withCoords.length
    ? [withCoords[0].latitude, withCoords[0].longitude]
    : [33.6844, 73.0479] // Islamabad fallback if no cameras have coordinates yet

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-900" style={{ height: 320 }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {withCoords.map((cam) => (
          <Marker
            key={cam.id}
            position={[cam.latitude, cam.longitude]}
            eventHandlers={{ click: () => router.push(`/dashboard/cameras/${cam.id}`) }}
          >
            <Popup>{cam.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}