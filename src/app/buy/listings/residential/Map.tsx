'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { PropertyItem } from './schema';

// dynamic import leaflet to avoid SSR issues
const LeafletMap = dynamic(
  async () => {
    const L = await import('leaflet');
    // Import CSS dynamically
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    return function MapInner({
      items,
      onHover,
      onSearchInArea,
    }: {
      items: PropertyItem[];
      onHover: (id: string | null) => void;
      onSearchInArea: (bbox: string) => void;
    }) {
      useEffect(() => {
        const mapEl = document.getElementById('map')!;
        const map = L.map(mapEl).setView([39.3999, -8.2245], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
        }).addTo(map);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markers: any[] = [];
        (items as PropertyItem[]).forEach((it) => {
          if (it.lat != null && it.lng != null) {
            const m = L.marker([Number(it.lat), Number(it.lng)]).addTo(map);
            m.on('mouseover', () => onHover(it.id));
            m.on('mouseout', () => onHover(null));
            markers.push(m);
          }
        });

        if (markers.length) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        const button = document.getElementById('search-in-area-btn');
        button?.addEventListener('click', () => {
          const b = map.getBounds();
          const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
          onSearchInArea(bbox);
        });

        return () => {
          map.remove();
        };
      }, [items, onHover, onSearchInArea]);

      return (
        <div className="relative">
          <div
            id="map"
            className="rounded-lg shadow-md"
            style={{ height: 600 }}
          />
          <button
            id="search-in-area-btn"
            className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow"
          >
            Search in this area
          </button>
        </div>
      );
    };
  },
  { ssr: false }
);

export default function MapView({
  items,
  onHover,
  onSearchInArea,
}: {
  items: PropertyItem[];
  onHover: (id: string | null) => void;
  onSearchInArea: (bbox: string) => void;
}) {
  return (
    <LeafletMap
      items={items}
      onHover={onHover}
      onSearchInArea={onSearchInArea}
    />
  );
}
