import { useEffect, useRef } from "react";

// Declare L as global since we use CDN
declare const L: any;

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popupContent?: string;
    iconColor?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

const MapComponent = ({
  center,
  zoom = 13,
  markers = [],
  onMapClick,
  className = "w-full h-full"
}: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      if (onMapClick) {
        mapInstanceRef.current.on("click", (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    // Cleanup existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = L.marker(markerData.position).addTo(mapInstanceRef.current);
      if (markerData.popupContent) {
        marker.bindPopup(markerData.popupContent);
      }
      markersRef.current.push(marker);
    });

    return () => {
      // We don't necessarily want to destroy the map on every re-render, 
      // but if the component unmounts, we should.
    };
  }, [center, zoom, markers, onMapClick]);

  return <div ref={mapContainerRef} className={`rounded-xl overflow-hidden grayscale brightness-75 contrast-125 ${className}`} style={{ minHeight: "400px" }} />;
};

export default MapComponent;
