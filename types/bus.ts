export interface Bus {
  id: string;
  region: string;

  latitude: number;
  longitude: number;

  satellites?: number;
  speed?: number;

  status: "In Transit" | "Stopped" | "Delayed" | string;

  updatedAt: number;
}
