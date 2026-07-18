'use client'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

export default function ZoneDrawer({ imageUrl, initialZone, onChange, readOnly = false }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (!dimensions || mapRef.current) return

    const bounds = [[0, 0], [dimensions.height, dimensions.width]]

    const map = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 2,
    })

    L.imageOverlay(imageUrl, bounds).addTo(map)
    map.fitBounds(bounds)

    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    if (initialZone && initialZone.length > 0) {
      drawnItems.addLayer(L.polygon(initialZone))
    }

    if (!readOnly) {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: { allowIntersection: false, showArea: false },
          marker: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          polyline: false,
        },
        edit: { featureGroup: drawnItems },
      })
      map.addControl(drawControl)

      function emitZone() {
        const layers = drawnItems.getLayers()
        if (layers.length === 0) {
          onChange(null)
          return
        }
        const points = layers[0].getLatLngs()[0].map((p) => [p.lat, p.lng])
        onChange(points)
      }

      map.on(L.Draw.Event.CREATED, (e) => {
        drawnItems.clearLayers()
        drawnItems.addLayer(e.layer)
        emitZone()
      })
      map.on(L.Draw.Event.EDITED, emitZone)
      map.on(L.Draw.Event.DELETED, emitZone)
    }

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [dimensions, imageUrl, readOnly])

  if (!dimensions) return <div className="p-6 text-zinc-400 text-sm">Loading image...</div>

  return (
    <div
      ref={containerRef}
      style={{ height: 500, width: '100%' }}
      className="rounded-xl overflow-hidden border border-zinc-900"
    />
  )
}