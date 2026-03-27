import { useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

// Declare L as global since we use CDN
declare const L: any;

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popupContent?: string;
    iconColor?: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  showUserLocation?: boolean;
  useGps?: boolean;
}

const MapComponent = ({
  center,
  zoom = 13,
  markers = [],
  onMapClick,
  className = "w-full h-full",
  showUserLocation = true,
  useGps = true
}: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userLocationRef = useRef<any>(null);
  
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();

  // Use GPS location or fallback to provided center
  const mapCenter = useGps && userLocation 
    ? [userLocation.latitude, userLocation.longitude] as [number, number]
    : center || [28.6139, 77.2090]; // Default to Delhi

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView(mapCenter, zoom);

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
      mapInstanceRef.current.setView(mapCenter, zoom);
    }

    // Clear all existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    
    // Clear user location marker
    if (userLocationRef.current) {
      userLocationRef.current.remove();
      userLocationRef.current = null;
    }

    // Add user location marker (blue dot) - distinct from grievance pins
    if (showUserLocation && userLocation && !locationError) {
      const userIcon = L.divIcon({
        html: `
          <div class="relative w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
            <div class="absolute w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
            <div class="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
            <div class="absolute w-2 h-2 bg-white rounded-full top-1 left-1"></div>
          </div>
        `,
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      userLocationRef.current = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon, zIndex: 1000 })
        .addTo(mapInstanceRef.current)
        .bindPopup(`Your Current Location<br>Accuracy: ${userLocation.accuracy ? Math.round(userLocation.accuracy) + 'm' : 'Unknown'}`);
      
      markersRef.current.push(userLocationRef.current);
    }

    // Add grievance markers (colored pins based on priority)
    markers.forEach((markerData) => {
      const getPinColor = (color: string) => {
        switch (color) {
          case 'red': return '#ef4444';
          case 'orange': return '#f97316';
          default: return '#000000';
        }
      };
      
      const pinColor = getPinColor(markerData.iconColor || 'black');
      
      const grievanceIcon = L.divIcon({
        html: `
          <div class="relative w-8 h-8 -translate-x-1/2 -translate-y-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C16 17.5 19 14 19 9.5C19 5.35786 15.6421 2 12 2C8.35786 2 5 5.35786 5 9.5C5 14 8 17.5 12 21Z" fill="${pinColor}" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="9.5" r="3" fill="white"/>
            </svg>
          </div>
        `,
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker(markerData.position, { icon: grievanceIcon, zIndex: 500 }).addTo(mapInstanceRef.current);
      if (markerData.popupContent) {
        marker.bindPopup(markerData.popupContent);
      }
      markersRef.current.push(marker);
    });

    return () => {
      // Cleanup
    };
  }, [mapCenter, zoom, markers, onMapClick, showUserLocation, userLocation, locationError]);

  // Update map view when user location changes
  useEffect(() => {
    if (mapInstanceRef.current && userLocation && useGps && !locationError) {
      mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], zoom);
    }
  }, [userLocation, zoom, useGps, locationError]);

  return (
    <div className="relative">
      {locationLoading && (
        <div className="absolute top-4 left-4 z-10 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
          Getting your location...
        </div>
      )}
      {locationError && (
        <div className="absolute top-4 left-4 z-10 bg-red-500/80 text-white px-3 py-2 rounded-lg text-sm max-w-xs">
          {locationError}
        </div>
      )}
      {userLocation && !locationError && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/80 text-white px-3 py-2 rounded-lg text-xs">
          📍 Your Location
          {userLocation.accuracy && (
            <div className="text-xs opacity-75">
              ±{Math.round(userLocation.accuracy)}m
            </div>
          )}
        </div>
      )}
      <div ref={mapContainerRef} className={`rounded-[2rem] overflow-hidden grayscale brightness-[1.05] contrast-[0.9] border border-white/5 opacity-80 ${className}`} style={{ minHeight: "400px" }} />
    </div>
  );
};

export default MapComponent;
