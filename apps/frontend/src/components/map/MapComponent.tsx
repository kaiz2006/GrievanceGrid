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

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
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

    // Define custom black icon
    const blackIcon = L.divIcon({
      html: `
        <div class="relative w-8 h-8 -translate-x-1/2 -translate-y-full flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16 17.5 19 14 19 9.5C19 5.35786 15.6421 2 12 2C8.35786 2 5 5.35786 5 9.5C5 14 8 17.5 12 21Z" fill="black" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="9.5" r="3" fill="white"/>
          </svg>
        </div>
      `,
      className: '',
      iconSize: [0, 0], // Sized by div inside
      iconAnchor: [0, 0]
    });

    // Add new markers
    markers.forEach((markerData) => {
      const marker = L.marker(markerData.position, { icon: blackIcon }).addTo(mapInstanceRef.current);
      if (markerData.popupContent) {
        marker.bindPopup(markerData.popupContent);
      }
      markersRef.current.push(marker);
    });

    return () => {
      // Cleanup
    };
  }, [center, zoom, markers, onMapClick]);

  return <div ref={mapContainerRef} className={`rounded-[2rem] overflow-hidden grayscale brightness-[1.05] contrast-[0.9] border border-white/5 opacity-80 ${className}`} style={{ minHeight: "400px" }} />;
};

export default MapComponent;
