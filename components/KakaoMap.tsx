"use client";

import { useEffect, useRef, useState } from "react";
import { Restaurant } from "@/types/restaurant";
import { buildCardStackSVG } from "@/lib/cardMarker";
import { applyJitter } from "@/lib/jitter";

interface KakaoMapProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (r: Restaurant) => void;
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";

const SEOUL_BOUNDS = {
  swLat: 37.2,
  swLng: 126.5,
  neLat: 37.9,
  neLng: 127.4,
};

const DETAIL_ZOOM_THRESHOLD = 6;

function AimIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}

export default function KakaoMap({ restaurants, onSelectRestaurant }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setSdkLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false&libraries=clusterer`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setSdkLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !mapRef.current || mapInstance.current) return;

    const center = new window.kakao.maps.LatLng(37.5665, 126.978);
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 8,
    });
    map.setMaxLevel(11);

    const sw = new window.kakao.maps.LatLng(SEOUL_BOUNDS.swLat, SEOUL_BOUNDS.swLng);
    const ne = new window.kakao.maps.LatLng(SEOUL_BOUNDS.neLat, SEOUL_BOUNDS.neLng);
    const bounds = new window.kakao.maps.LatLngBounds(sw, ne);

    window.kakao.maps.event.addListener(map, "dragend", () => {
      const c = map.getCenter();
      if (!bounds.contain(c)) {
        map.panTo(center);
      }
    });

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: DETAIL_ZOOM_THRESHOLD,
      minClusterSize: 2,
      disableClickZoom: false,
      styles: [
        {
          width: "44px",
          height: "44px",
          background: "rgba(192, 57, 43, 0.82)",
          borderRadius: "50%",
          color: "#fff",
          textAlign: "center",
          lineHeight: "44px",
          fontSize: "13px",
          fontWeight: "500",
        },
      ],
    });
    clustererRef.current = clusterer;
    mapInstance.current = map;
  }, [sdkLoaded]);

  useEffect(() => {
    if (!sdkLoaded || !mapInstance.current || !clustererRef.current) return;

    let cancelled = false;

    const renderMarkers = () => {
      if (cancelled) return;
      clustererRef.current.clear();
      markersRef.current.forEach((m: any) => m.setMap(null));
      markersRef.current = [];

      const jittered = applyJitter(restaurants);

      const markers = jittered.map((r) => {
        const { svg, width, height } = buildCardStackSVG(r.tier);
        const imageSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
        const imageSize = new window.kakao.maps.Size(width, height);
        const imageOption = { offset: new window.kakao.maps.Point(width / 2, height) };
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        const position = new window.kakao.maps.LatLng(r.jitteredLat, r.jitteredLng);
        const marker = new window.kakao.maps.Marker({
          position,
          image: markerImage,
          title: r.name,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          onSelectRestaurant(r);
        });

        return marker;
      });

      markersRef.current = markers;
      clustererRef.current.addMarkers(markers);
    };

    const id = window.requestAnimationFrame(() => {
      window.setTimeout(renderMarkers, 0);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [sdkLoaded, restaurants, onSelectRestaurant]);

  const handleGps = () => {
    if (!mapInstance.current) return;
    if (!navigator.geolocation) {
      setGpsError("이 브라우저는 GPS를 지원하지 않아요");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = new window.kakao.maps.LatLng(latitude, longitude);
        mapInstance.current.panTo(latlng);
        setGpsLoading(false);
      },
      () => {
        setGpsError("위치 정보를 가져올 수 없어요");
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* GPS 버튼 */}
      <button
        onClick={handleGps}
        aria-label="내 위치로 이동"
        disabled={gpsLoading}
        className="absolute bottom-8 right-4 z-30 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform text-[var(--color-text)] disabled:opacity-50"
      >
        {gpsLoading ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="animate-spin">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        ) : (
          <AimIcon />
        )}
      </button>

      {/* GPS 에러 토스트 */}
      {gpsError && (
        <div className="absolute bottom-24 right-4 z-30 bg-black/75 text-white text-xs px-3 py-2 rounded-xl max-w-[180px] text-center"
          onClick={() => setGpsError(null)}
        >
          {gpsError}
        </div>
      )}

      {!sdkLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <span className="text-sm text-[var(--color-text-muted)]">지도를 불러오는 중...</span>
        </div>
      )}
    </div>
  );
}
