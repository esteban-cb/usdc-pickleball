'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

interface MapComponentProps {
  onLocationSelect: (coords: [number, number]) => void;
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const provider = new OpenStreetMapProvider();
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([40.7128, -74.0060], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      mapRef.current = map;
      setIsMapReady(true);

      // Add click handler to map
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
        onLocationSelect([lat, lng]);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [onLocationSelect]);

  const searchLocation = async (query: string) => {
    if (!isMapReady || !mapRef.current) return;
    
    try {
      const results = await provider.search({ query });
      if (results.length > 0) {
        const { x, y } = results[0];
        const coords: [number, number] = [y, x];
        
        mapRef.current.setView(coords, 13);
        if (markerRef.current) {
          markerRef.current.setLatLng(coords);
        } else {
          markerRef.current = L.marker(coords).addTo(mapRef.current);
        }
        onLocationSelect(coords);
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search location..."
        onChange={(e) => {
          if (e.target.value.length > 2) {
            searchLocation(e.target.value);
          }
        }}
        className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
      />
      <div id="map" className="h-[300px] rounded-xl"></div>
    </div>
  );
} 