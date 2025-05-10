"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface AirQualityData {
  co2: number;
  no2: number;
  so2: number;
  pm25: number;
}

interface WaterQualityData {
  ph: number;
  dissolved_oxygen: number;
  oil_spill_detected: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface EnvironmentalData {
  id: number;
  sensor_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  air_quality: AirQualityData;
  water_quality: WaterQualityData;
  noise_level: number;
  location: LocationData;
}

export default function HistoricalDataPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [data, setData] = useState<EnvironmentalData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/environmental/historical?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`
      );
      const result = await response.json();

      const processedData = result.data.map((item: any) => ({
        ...item,
        temperature: Number(item.temperature),
        humidity: Number(item.humidity),
        air_quality:
          typeof item.air_quality === "string"
            ? JSON.parse(item.air_quality)
            : item.air_quality,
        water_quality:
          typeof item.water_quality === "string"
            ? JSON.parse(item.water_quality)
            : item.water_quality,
        noise_level: Number(item.noise_level),
        location:
          typeof item.location === "string"
            ? JSON.parse(item.location)
            : item.location,
      }));

      setData(processedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const csvData = data.map((item) => ({
        timestamp: format(new Date(item.timestamp), "yyyy-MM-dd HH:mm:ss"),
        temperature: item.temperature,
        humidity: item.humidity,
        co2: item.air_quality.co2,
        no2: item.air_quality.no2,
        so2: item.air_quality.so2,
        pm25: item.air_quality.pm25,
        ph: item.water_quality.ph,
        dissolved_oxygen: item.water_quality.dissolved_oxygen,
        oil_spill_detected: item.water_quality.oil_spill_detected,
        noise_level: item.noise_level,
        latitude: item.location.latitude,
        longitude: item.location.longitude,
        sensor_id: item.sensor_id,
      }));

      const response = await fetch(
        `/api/environmental/export?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: csvData }),
        }
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `environmental-data-${format(
        dateRange.from,
        "yyyy-MM-dd"
      )}-to-${format(dateRange.to, "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const calculateStats = (data: EnvironmentalData[]) => {
    if (!data || data.length === 0) return null;

    const stats = {
      temperature: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      humidity: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      co2: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      no2: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      so2: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      pm25: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      ph: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
      dissolved_oxygen: {
        min: Number.MAX_VALUE,
        max: Number.MIN_VALUE,
        avg: 0,
      },
      noise_level: { min: Number.MAX_VALUE, max: Number.MIN_VALUE, avg: 0 },
    };

    let validDataCount = {
      temperature: 0,
      humidity: 0,
      co2: 0,
      no2: 0,
      so2: 0,
      pm25: 0,
      ph: 0,
      dissolved_oxygen: 0,
      noise_level: 0,
    };

    data.forEach((item) => {
      const basicMetrics = ["temperature", "humidity", "noise_level"] as const;
      basicMetrics.forEach((metric) => {
        const value = Number(item[metric]);
        if (!isNaN(value)) {
          stats[metric].min = Math.min(stats[metric].min, value);
          stats[metric].max = Math.max(stats[metric].max, value);
          stats[metric].avg += value;
          validDataCount[metric]++;
        }
      });

      const airMetrics = ["co2", "no2", "so2", "pm25"] as const;
      airMetrics.forEach((metric) => {
        const value = Number(item.air_quality[metric]);
        if (!isNaN(value)) {
          stats[metric].min = Math.min(stats[metric].min, value);
          stats[metric].max = Math.max(stats[metric].max, value);
          stats[metric].avg += value;
          validDataCount[metric]++;
        }
      });

      const waterMetrics = ["ph", "dissolved_oxygen"] as const;
      waterMetrics.forEach((metric) => {
        const value = Number(item.water_quality[metric]);
        if (!isNaN(value)) {
          stats[metric].min = Math.min(stats[metric].min, value);
          stats[metric].max = Math.max(stats[metric].max, value);
          stats[metric].avg += value;
          validDataCount[metric]++;
        }
      });
    });

    Object.keys(stats).forEach((key) => {
      if (validDataCount[key as keyof typeof validDataCount] > 0) {
        stats[key as keyof typeof stats].avg /=
          validDataCount[key as keyof typeof validDataCount];
      } else {
        stats[key as keyof typeof stats].min = 0;
        stats[key as keyof typeof stats].max = 0;
        stats[key as keyof typeof stats].avg = 0;
      }
    });

    return stats;
  };

  const stats = calculateStats(data);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentData = data.find((d) => d.timestamp === label);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">
            {format(new Date(label), "MM/dd/yyyy HH:mm")}
          </p>

          <div className="mt-2">
            <p className="font-semibold text-sm">Basic Metrics:</p>
            <p>Temperature: {currentData?.temperature.toFixed(2)}°C</p>
            <p>Humidity: {currentData?.humidity.toFixed(2)}%</p>
            <p>Noise Level: {currentData?.noise_level.toFixed(2)} dB</p>
          </div>

          <div className="mt-2">
            <p className="font-semibold text-sm">Air Quality:</p>
            <p>CO2: {currentData?.air_quality.co2.toFixed(2)} ppm</p>
            <p>NO2: {currentData?.air_quality.no2.toFixed(2)} ppb</p>
            <p>SO2: {currentData?.air_quality.so2.toFixed(2)} ppb</p>
            <p>PM2.5: {currentData?.air_quality.pm25.toFixed(2)} µg/m³</p>
          </div>

          <div className="mt-2">
            <p className="font-semibold text-sm">Water Quality:</p>
            <p>pH: {currentData?.water_quality.ph.toFixed(2)}</p>
            <p>
              Dissolved Oxygen:{" "}
              {currentData?.water_quality.dissolved_oxygen.toFixed(2)} mg/L
            </p>
            <p>
              Oil Spill:{" "}
              {currentData?.water_quality.oil_spill_detected
                ? "Detected"
                : "Not Detected"}
            </p>
          </div>

          {stats && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="font-semibold text-sm">Statistics:</p>
              {Object.entries(stats).map(([key, value]) => (
                <p key={key} className="text-sm">
                  {key}: Min {value.min.toFixed(2)}, Max {value.max.toFixed(2)},
                  Avg {value.avg.toFixed(2)}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Historical Environmental Data
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and analyze environmental data over time
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Data
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={format(dateRange.from, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      from: new Date(e.target.value),
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={format(dateRange.to, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      to: new Date(e.target.value),
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={fetchHistoricalData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed h-[42px]"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Fetch Data"
              )}
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) =>
                    format(new Date(value), "MM/dd HH:mm")
                  }
                  stroke="#666"
                  tick={{ fill: "#666" }}
                />
                <YAxis stroke="#666" tick={{ fill: "#666" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  name="Temperature (°C)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#82ca9d"
                  name="Humidity (%)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="air_quality.co2"
                  stroke="#ffc658"
                  name="CO2 (ppm)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="air_quality.no2"
                  stroke="#ff8042"
                  name="NO2 (ppb)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="air_quality.so2"
                  stroke="#0088fe"
                  name="SO2 (ppb)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="air_quality.pm25"
                  stroke="#00C49F"
                  name="PM2.5 (µg/m³)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="water_quality.ph"
                  stroke="#FFBB28"
                  name="pH"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="water_quality.dissolved_oxygen"
                  stroke="#FF8042"
                  name="Dissolved Oxygen (mg/L)"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="noise_level"
                  stroke="#8884d8"
                  name="Noise Level (dB)"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
