"use server";

import { Sensor } from "../types/environmental";

export async function getSensors(): Promise<Sensor[]> {
  try {
    const response = await fetch("http://localhost:3001/api/sensors", {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sensors");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching sensors:", error);
    return [];
  }
}

export async function fetchAllVessels() {
  try {
    const response = await fetch("http://localhost:3001/api/vessels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vessels");
    }

    const data = await response.json();
    return { vessels: data, error: null };
  } catch (error) {
    console.error("Error fetching vessels:", error);
    return { vessels: [], error: "Failed to fetch vessels" };
  }
}
