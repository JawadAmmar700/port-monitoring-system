import { Sensor } from '@/types/environmental'

export const mockSensors: Sensor[] = [
    {
        id: "sensor-001",
        name: "Downtown Air Quality Station",
        type: "air_quality"
    },
    {
        id: "sensor-002",
        name: "Hudson River Water Quality Monitor",
        type: "water_quality"
    },
    {
        id: "sensor-003",
        name: "Central Park Noise Monitor",
        type: "noise"
    },
    {
        id: "sensor-004",
        name: "Financial District Temperature Station",
        type: "temperature"
    },
    {
        id: "sensor-005",
        name: "East River Humidity Monitor",
        type: "humidity"
    }
] 