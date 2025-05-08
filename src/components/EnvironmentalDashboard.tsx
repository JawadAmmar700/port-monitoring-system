"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Sensor } from "../types/environmental";
import {
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";
import { socketService } from "../services/socket";
import { EnvironmentalError } from "./EnvironmentalError";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnvironmentalRecord {
  id: string;
  timestamp: string;
  air_quality: {
    co2: number;
    no2: number;
    so2: number;
    pm25: number;
  };
  water_quality: {
    ph: number;
    dissolved_oxygen: number;
    oil_spill_detected: boolean;
  };
  noise_level: number;
  temperature: number;
  humidity: number;
}

const EnvironmentalDashboard = () => {
  const [records, setRecords] = useState<EnvironmentalRecord[]>([]);
  const [selectedAirMetrics, setSelectedAirMetrics] = useState<string[]>([
    "co2",
    "no2",
    "pm25",
    "so2",
  ]);
  const [selectedEnvMetrics, setSelectedEnvMetrics] = useState<string[]>([
    "temperature",
    "humidity",
    "noise_level",
  ]);
  const [progress, setProgress] = useState<{
    latestRecord: EnvironmentalRecord;
  } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    error: string | null;
  }>({
    isConnected: false,
    error: null,
  });
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  useEffect(() => {
    // Connect to socket
    socketService.connect();

    // Set up connection status listener
    const handleConnect = () => {
      setConnectionStatus({ isConnected: true, error: null });
      setIsSocketInitialized(true);
    };

    const handleDisconnect = () => {
      setConnectionStatus({
        isConnected: false,
        error: "Server connection lost. Please try again later.",
      });
      setIsSocketInitialized(true);
    };

    const handleConnectError = () => {
      setConnectionStatus({
        isConnected: false,
        error: "Server is down. Please try again later.",
      });
      setIsSocketInitialized(true);
    };

    const handleEnvironmentalData = (data: EnvironmentalRecord) => {
      setRecords((prev) => [...prev, data].slice(-50));
      setProgress({ latestRecord: data });
    };

    // Get initial connection status
    const initialStatus = socketService.getConnectionStatus();
    setConnectionStatus(initialStatus);
    setIsSocketInitialized(
      initialStatus.isConnected || initialStatus.error !== null
    );

    // Set up event listeners
    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on("connect_error", handleConnectError);
    socketService.on("environmentalData", handleEnvironmentalData);

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
      socketService.off("connect_error", handleConnectError);
      socketService.off("environmentalData", handleEnvironmentalData);
    };
  }, []);

  // Show loading state while socket is initializing
  if (!isSocketInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // Show error page if there's a connection error
  if (!connectionStatus.isConnected && connectionStatus.error) {
    return (
      <EnvironmentalError
        error={connectionStatus.error}
        onRetry={() => {
          socketService.connect();
        }}
      />
    );
  }

  const toggleAirMetric = (metric: string) => {
    setSelectedAirMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const toggleEnvMetric = (metric: string) => {
    setSelectedEnvMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Environmental Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Real-time monitoring and analysis of port environmental conditions
          </p>

          {/* Real-time Metrics Section */}
          {progress && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Air Quality Metrics */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-blue-800">CO2</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {progress.latestRecord.air_quality.co2.toFixed(1)} ppm
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-blue-800">NO2</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {progress.latestRecord.air_quality.no2.toFixed(1)} ppb
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-blue-800">PM2.5</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {progress.latestRecord.air_quality.pm25.toFixed(1)} µg/m³
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-blue-800">SO2</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {progress.latestRecord.air_quality.so2.toFixed(1)} ppb
                </p>
              </div>

              {/* Water Quality Metrics */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-green-800">pH</h3>
                <p className="text-2xl font-bold text-green-600">
                  {progress.latestRecord.water_quality.ph.toFixed(1)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-green-800">
                  Dissolved Oxygen
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {progress.latestRecord.water_quality.dissolved_oxygen.toFixed(
                    1
                  )}{" "}
                  mg/L
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-green-800">Oil Spill</h3>
                <p className="text-2xl font-bold text-green-600">
                  {progress.latestRecord.water_quality.oil_spill_detected
                    ? "Detected"
                    : "None"}
                </p>
              </div>

              {/* Other Metrics */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-purple-800">Noise Level</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {progress.latestRecord.noise_level.toFixed(1)} dB
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-purple-800">Temperature</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {progress.latestRecord.temperature.toFixed(1)}°C
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-purple-800">Humidity</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {progress.latestRecord.humidity.toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {/* Time Series Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Environmental Data Over Time
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString()
                    }
                  />
                  <YAxis />
                  <RechartsTooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <RechartsLegend />
                  <RechartsLine
                    type="monotone"
                    dataKey="air_quality.co2"
                    stroke="#8884d8"
                    name="CO2 (ppm)"
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="air_quality.no2"
                    stroke="#82ca9d"
                    name="NO2 (ppb)"
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="air_quality.pm25"
                    stroke="#ff7300"
                    name="PM2.5 (µg/m³)"
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="air_quality.so2"
                    stroke="#0088fe"
                    name="SO2 (ppb)"
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="temperature"
                    stroke="#00C49F"
                    name="Temperature (°C)"
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="humidity"
                    stroke="#FFBB28"
                    name="Humidity (%)"
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="noise_level"
                    stroke="#FF8042"
                    name="Noise (dB)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Air Quality and Water Quality Charts - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Air Quality Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Air Quality Metrics
              </h3>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {["co2", "no2", "pm25", "so2"].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => toggleAirMetric(metric)}
                      className={`px-3 py-1 rounded ${
                        selectedAirMetrics.includes(metric)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {metric.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              {records.length > 0 && (
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: records.map((r) =>
                        new Date(r.timestamp).toLocaleTimeString()
                      ),
                      datasets: [
                        {
                          label: "CO2 (ppm)",
                          data: records.map((r) => r.air_quality.co2),
                          borderColor: "rgb(255, 99, 132)",
                          tension: 0.1,
                          hidden: !selectedAirMetrics.includes("co2"),
                        },
                        {
                          label: "NO2 (ppb)",
                          data: records.map((r) => r.air_quality.no2),
                          borderColor: "rgb(54, 162, 235)",
                          tension: 0.1,
                          hidden: !selectedAirMetrics.includes("no2"),
                        },
                        {
                          label: "PM2.5 (µg/m³)",
                          data: records.map((r) => r.air_quality.pm25),
                          borderColor: "rgb(75, 192, 192)",
                          tension: 0.1,
                          hidden: !selectedAirMetrics.includes("pm25"),
                        },
                        {
                          label: "SO2 (ppb)",
                          data: records.map((r) => r.air_quality.so2),
                          borderColor: "rgb(255, 159, 64)",
                          tension: 0.1,
                          hidden: !selectedAirMetrics.includes("so2"),
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                        title: {
                          display: true,
                          text: "Air Quality Over Time",
                        },
                      },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: "Time",
                          },
                        },
                        y: {
                          display: true,
                          title: {
                            display: true,
                            text: "Value",
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* Water Quality Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Water Quality Metrics
              </h3>
              {records.length > 0 && (
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: records.map((r) =>
                        new Date(r.timestamp).toLocaleTimeString()
                      ),
                      datasets: [
                        {
                          label: "pH",
                          data: records.map((r) => r.water_quality.ph),
                          borderColor: "rgb(156, 39, 176)",
                          tension: 0.1,
                        },
                        {
                          label: "Dissolved Oxygen (mg/L)",
                          data: records.map(
                            (r) => r.water_quality.dissolved_oxygen
                          ),
                          borderColor: "rgb(33, 150, 243)",
                          tension: 0.1,
                        },
                        {
                          label: "Oil Spill Detected",
                          data: records.map((r) =>
                            r.water_quality.oil_spill_detected ? 1 : 0
                          ),
                          borderColor: "rgb(244, 67, 54)",
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                        title: {
                          display: true,
                          text: "Water Quality Over Time",
                        },
                      },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: "Time",
                          },
                        },
                        y: {
                          display: true,
                          title: {
                            display: true,
                            text: "Value",
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Environmental Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Environmental Metrics
            </h3>
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {["temperature", "humidity", "noise_level"].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => toggleEnvMetric(metric)}
                    className={`px-3 py-1 rounded ${
                      selectedEnvMetrics.includes(metric)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {metric
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </button>
                ))}
              </div>
            </div>
            {records.length > 0 && (
              <div className="h-[300px]">
                <Line
                  data={{
                    labels: records.map((r) =>
                      new Date(r.timestamp).toLocaleTimeString()
                    ),
                    datasets: [
                      {
                        label: "Temperature (°C)",
                        data: records.map((r) => r.temperature),
                        borderColor: "rgb(153, 102, 255)",
                        tension: 0.1,
                        hidden: !selectedEnvMetrics.includes("temperature"),
                      },
                      {
                        label: "Humidity (%)",
                        data: records.map((r) => r.humidity),
                        borderColor: "rgb(255, 205, 86)",
                        tension: 0.1,
                        hidden: !selectedEnvMetrics.includes("humidity"),
                      },
                      {
                        label: "Noise Level (dB)",
                        data: records.map((r) => r.noise_level),
                        borderColor: "rgb(201, 203, 207)",
                        tension: 0.1,
                        hidden: !selectedEnvMetrics.includes("noise_level"),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                      title: {
                        display: true,
                        text: "Environmental Data Over Time",
                      },
                    },
                    scales: {
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: "Time",
                        },
                      },
                      y: {
                        display: true,
                        title: {
                          display: true,
                          text: "Value",
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDashboard;
