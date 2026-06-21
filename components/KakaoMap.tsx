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

// 줌 레벨이 이 값보다 낮을 때(=확대됐을 때)만 개별 카드스택 마커 표시
const DETAIL_ZOOM_THRESHOLD = 6;

export default function KakaoMap({ restaurants, onSelectRestaurant }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);

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

    // 지도가 먼저 보이도록, 마커 생성은 한 프레임 뒤로 미룸
    const id = window.requestAnimationFrame(() => {
      window.setTimeout(renderMarkers, 0);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [sdkLoaded, restaurants, onSelectRestaurant]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!sdkLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <span className="text-sm text-[var(--color-text-muted)]">지도를 불러오는 중...</span>
        </div>
      )}
    </div>
  );
}
