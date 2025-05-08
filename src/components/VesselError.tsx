"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface VesselErrorProps {
  error?: string;
  onRetry?: () => void;
}

export function VesselError({ error, onRetry }: VesselErrorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Vessel Data Connection Error
      </h2>

      <p className="text-gray-600 text-center mb-4">
        {error ||
          "Unable to connect to the vessel tracking system. Please try again later."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
