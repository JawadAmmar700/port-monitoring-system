import { Vessel } from "@/types/vessel";
import { useEffect, useState } from "react";
import { socketService } from "@/services/socket";

interface VesselDetailsProps {
  vessel: Vessel;
  onClose: () => void;
}

export default function VesselDetails({
  vessel: initialVessel,
  onClose,
}: VesselDetailsProps) {
  const [vessel, setVessel] = useState<Vessel>(initialVessel);

  useEffect(() => {
    const handleVesselUpdate = (updatedVessel: Vessel) => {
      if (updatedVessel.id === vessel.id) {
        setVessel((prev) => ({
          ...prev,
          ...updatedVessel,
          createdAt: prev.createdAt,
          updatedAt: new Date().toISOString(),
        }));
      }
    };

    socketService.on("vesselData", handleVesselUpdate);

    return () => {
      socketService.off("vesselData", handleVesselUpdate);
    };
  }, [vessel.id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTimeLeft = (minutes: number) => {
    if (typeof minutes !== "number" || isNaN(minutes)) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{vessel.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Vessel Information
          </h3>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <p>
              <span className="font-medium text-gray-600">Type:</span>{" "}
              <span className="text-gray-800">{vessel.type}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Status:</span>{" "}
              <span className="text-gray-800">{vessel.status}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Load Type:</span>{" "}
              <span className="text-gray-800">{vessel.loadType}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Capacity:</span>{" "}
              <span className="text-gray-800">
                {vessel.capacityTons.toLocaleString()} tons
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Current Load:</span>{" "}
              <span className="text-gray-800">
                {vessel.loadTons.toLocaleString()} tons
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Location & Schedule
          </h3>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <p>
              <span className="font-medium text-gray-600">Current Port:</span>{" "}
              <span className="text-gray-800">{vessel.arrivedTo}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">
                Next Destination:
              </span>{" "}
              <span className="text-gray-800">{vessel.nextDestination}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Time Left:</span>{" "}
              <span className="text-gray-800">
                {formatTimeLeft(vessel.timeLeftMinutes)}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Arrival Time:</span>{" "}
              <span className="text-gray-800">
                {formatDate(vessel.arrivalTime.toString())}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Technical Details
          </h3>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <p>
              <span className="font-medium text-gray-600">Length:</span>{" "}
              <span className="text-gray-800">{vessel.lengthMeters}m</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Width:</span>{" "}
              <span className="text-gray-800">{vessel.widthMeters}m</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">
                Fuel Consumption:
              </span>{" "}
              <span className="text-gray-800">
                {vessel.fuelConsumptionLitersPerHour.toLocaleString()} L/h
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Coordinates:</span>{" "}
              <span className="text-gray-800">
                {vessel.latitude.toFixed(4)}, {vessel.longitude.toFixed(4)}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Timestamps
          </h3>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <p>
              <span className="font-medium text-gray-600">Created:</span>{" "}
              <span className="text-gray-800">
                {formatDate(vessel.createdAt)}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Last Updated:</span>{" "}
              <span className="text-gray-800">
                {formatDate(vessel.updatedAt)}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Vessel Color
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div
              className="w-full h-8 rounded shadow-inner"
              style={{ backgroundColor: vessel.color }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
