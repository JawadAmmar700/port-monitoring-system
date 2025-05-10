import { getSensors } from "@/server/actions";
import { Sensor } from "@/types/environmental";

const getSensorTypeColor = (type: Sensor["type"]) => {
  switch (type) {
    case "air_quality":
      return "bg-blue-500";
    case "water_quality":
      return "bg-green-500";
    case "noise":
      return "bg-yellow-500";
    case "temperature":
      return "bg-red-500";
    case "humidity":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const getSensorTypeIcon = (type: Sensor["type"]) => {
  switch (type) {
    case "air_quality":
      return "🌬️";
    case "water_quality":
      return "💧";
    case "noise":
      return "🔊";
    case "temperature":
      return "🌡️";
    case "humidity":
      return "💦";
    default:
      return "📡";
  }
};

const getSensorDescription = (type: Sensor["type"]) => {
  switch (type) {
    case "air_quality":
      return "Monitors air quality parameters including CO2, NO2, SO2, and PM2.5 levels to ensure safe working conditions.";
    case "water_quality":
      return "Tracks water quality metrics such as pH levels, dissolved oxygen, and detects potential oil spills in the water.";
    case "noise":
      return "Measures ambient noise levels to ensure compliance with environmental regulations and worker safety standards.";
    case "temperature":
      return "Monitors temperature variations to maintain optimal conditions for equipment and personnel.";
    case "humidity":
      return "Tracks humidity levels to prevent equipment damage and ensure comfortable working conditions.";
    default:
      return "General purpose environmental monitoring sensor.";
  }
};

const getSensorSpecifications = (type: Sensor["type"]) => {
  switch (type) {
    case "air_quality":
      return {
        range: "CO2: 0-5000 ppm, NO2/SO2: 0-1000 ppb, PM2.5: 0-1000 µg/m³",
        accuracy: "±2% of reading",
        updateInterval: "1 minute",
      };
    case "water_quality":
      return {
        range: "pH: 0-14, DO: 0-20 mg/L",
        accuracy: "±0.1 pH, ±0.2 mg/L DO",
        updateInterval: "5 minutes",
      };
    case "noise":
      return {
        range: "30-130 dB",
        accuracy: "±1.5 dB",
        updateInterval: "30 seconds",
      };
    case "temperature":
      return {
        range: "-40°C to 85°C",
        accuracy: "±0.3°C",
        updateInterval: "1 minute",
      };
    case "humidity":
      return {
        range: "0-100% RH",
        accuracy: "±2% RH",
        updateInterval: "1 minute",
      };
    default:
      return {
        range: "N/A",
        accuracy: "N/A",
        updateInterval: "N/A",
      };
  }
};

export default async function SensorsPage() {
  const sensors = await getSensors();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sensors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => {
          const specs = getSensorSpecifications(sensor.type);
          return (
            <div
              key={sensor.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{sensor.name}</h2>
                <span className="text-2xl">
                  {getSensorTypeIcon(sensor.type)}
                </span>
              </div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getSensorTypeColor(
                  sensor.type
                )}`}
              >
                {sensor.type.replace("_", " ").toUpperCase()}
              </div>
              <p className="mt-2 text-sm text-gray-500">ID: {sensor.id}</p>

              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-600">
                  {getSensorDescription(sensor.type)}
                </p>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Specifications
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Range:</span> {specs.range}
                    </p>
                    <p>
                      <span className="font-medium">Accuracy:</span>{" "}
                      {specs.accuracy}
                    </p>
                    <p>
                      <span className="font-medium">Update Interval:</span>{" "}
                      {specs.updateInterval}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
