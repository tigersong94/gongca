import { Restaurant } from "@/types/restaurant";

// 같은 좌표로 간주할 거리 임계값(도 단위). 약 5~8m 이내면 "같은 자리"로 취급
const SAME_SPOT_THRESHOLD = 0.00007;

// jitter로 퍼뜨릴 반경(도 단위). 약 4~6m 정도 떨어뜨림
const JITTER_RADIUS = 0.00004;

interface JitteredRestaurant extends Restaurant {
  jitteredLat: number;
  jitteredLng: number;
}

/**
 * 좌표가 거의 동일한 식당들을 그룹으로 묶고, 그룹 내에서 원형으로 살짝 퍼뜨려
 * 지도 위 카드스택 마커가 완전히 겹치지 않도록 좌표를 보정한다.
 */
export function applyJitter(restaurants: Restaurant[]): JitteredRestaurant[] {
  const groups: Restaurant[][] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < restaurants.length; i++) {
    if (assigned.has(i)) continue;
    const group: Restaurant[] = [restaurants[i]];
    assigned.add(i);

    for (let j = i + 1; j < restaurants.length; j++) {
      if (assigned.has(j)) continue;
      const dLat = Math.abs(restaurants[i].lat - restaurants[j].lat);
      const dLng = Math.abs(restaurants[i].lng - restaurants[j].lng);
      if (dLat < SAME_SPOT_THRESHOLD && dLng < SAME_SPOT_THRESHOLD) {
        group.push(restaurants[j]);
        assigned.add(j);
      }
    }
    groups.push(group);
  }

  const result: JitteredRestaurant[] = [];
  for (const group of groups) {
    if (group.length === 1) {
      const r = group[0];
      result.push({ ...r, jitteredLat: r.lat, jitteredLng: r.lng });
      continue;
    }
    // 그룹 내 식당들을 원형으로 균등 배치
    const angleStep = (2 * Math.PI) / group.length;
    group.forEach((r, idx) => {
      const angle = angleStep * idx;
      result.push({
        ...r,
        jitteredLat: r.lat + JITTER_RADIUS * Math.cos(angle),
        jitteredLng: r.lng + JITTER_RADIUS * Math.sin(angle),
      });
    });
  }

  return result;
}
