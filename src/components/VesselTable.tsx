import { useState, useEffect } from "react";
import { Vessel } from "@/types/vessel";
import { socketService } from "@/services/socket";
import { VesselError } from "./VesselError";
import { fetchAllVessels } from "@/server/actions";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Ship,
  Anchor,
  Navigation,
  Package,
  Clock,
  MapPin,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface VesselTableProps {
  onVesselSelect: (vessel: Vessel) => void;
}

interface FilterState {
  type: string;
  status: string;
  loadType: string;
  arrivedTo: string;
}

export default function VesselTable({ onVesselSelect }: VesselTableProps) {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Vessel>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    status: "",
    loadType: "",
    arrivedTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch initial vessel data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const { vessels: initialVessels, error } = await fetchAllVessels();

      if (error) {
        setConnectionError(error);
      } else {
        setVessels(initialVessels);
      }
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // Socket connection and real-time updates
  useEffect(() => {
    socketService.connect();

    const handleVesselData = (vesselData: Vessel) => {
      setVessels((prevVessels) => {
        const index = prevVessels.findIndex((v) => v.id === vesselData.id);
        if (index === -1) {
          return [
            {
              ...vesselData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...prevVessels,
          ];
        }
        const newVessels = [...prevVessels];
        newVessels[index] = {
          ...newVessels[index],
          ...vesselData,
          createdAt: newVessels[index].createdAt,
          updatedAt: new Date().toISOString(),
        };
        return newVessels;
      });

      // Update selected vessel if it's the one being updated
      if (selectedVessel?.id === vesselData.id) {
        setSelectedVessel((prev) =>
          prev
            ? {
                ...prev,
                ...vesselData,
                createdAt: prev.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : null
        );
      }

      setConnectionError(null);
    };

    const checkConnection = () => {
      const { isConnected, error } = socketService.getConnectionStatus();
      if (!isConnected) {
        setConnectionError(error || "Connection lost");
      }
    };

    socketService.on("vesselData", handleVesselData);
    socketService.on("connect", () => setConnectionError(null));
    socketService.on("disconnect", checkConnection);
    socketService.on("connect_error", checkConnection);

    checkConnection();

    return () => {
      socketService.off("vesselData", handleVesselData);
      socketService.off("connect", () => setConnectionError(null));
      socketService.off("disconnect", checkConnection);
      socketService.off("connect_error", checkConnection);
    };
  }, [selectedVessel]);

  const handleRetry = () => {
    socketService.connect();
  };

  const handleVesselSelect = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    onVesselSelect(vessel);
  };

  const handleCloseDetails = () => {
    setSelectedVessel(null);
    onVesselSelect(null as any);
  };

  if (connectionError) {
    return <VesselError error={connectionError} onRetry={handleRetry} />;
  }

  const handleSort = (field: keyof Vessel) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new sort fields
    }
  };

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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getUniqueValues = (field: keyof Vessel) => {
    return Array.from(
      new Set(vessels.map((vessel) => vessel[field] as string))
    ).sort();
  };

  const filteredAndSortedVessels = vessels
    .filter((vessel) => {
      // Search filter (only for name and ID)
      const searchMatch =
        searchTerm === "" ||
        vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vessel.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Other filters
      const typeMatch = filters.type === "" || vessel.type === filters.type;
      const statusMatch =
        filters.status === "" || vessel.status === filters.status;
      const loadTypeMatch =
        filters.loadType === "" || vessel.loadType === filters.loadType;
      const arrivedToMatch =
        filters.arrivedTo === "" || vessel.arrivedTo === filters.arrivedTo;

      return (
        searchMatch &&
        typeMatch &&
        statusMatch &&
        loadTypeMatch &&
        arrivedToMatch
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        if (!isNaN(aDate) && !isNaN(bDate)) {
          return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
        }
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const getStatusColor = (status: string) => {
    const colors = {
      Docked: "bg-green-100 text-green-800",
      Anchored: "bg-blue-100 text-blue-800",
      "In Transit": "bg-purple-100 text-purple-800",
      Loading: "bg-yellow-100 text-yellow-800",
      Unloading: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getVesselIcon = (type: string) => {
    const icons = {
      "Container Ship": <Ship className="w-5 h-5" />,
      "Bulk Carrier": <Package className="w-5 h-5" />,
      "Oil Tanker": <Navigation className="w-5 h-5" />,
      "Cruise Ship": <Ship className="w-5 h-5" />,
      "Cargo Ship": <Package className="w-5 h-5" />,
    };
    return icons[type as keyof typeof icons] || <Ship className="w-5 h-5" />;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="sticky top-0 bg-white z-10 p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Vessel Management
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vessels by name, ID, or port..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vessel Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                {getUniqueValues("type").map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                {getUniqueValues("status").map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Load Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.loadType}
                onChange={(e) => handleFilterChange("loadType", e.target.value)}
              >
                <option value="">All Load Types</option>
                {getUniqueValues("loadType").map((loadType) => (
                  <option key={loadType} value={loadType}>
                    {loadType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Port
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.arrivedTo}
                onChange={(e) =>
                  handleFilterChange("arrivedTo", e.target.value)
                }
              >
                <option value="">All Ports</option>
                {getUniqueValues("arrivedTo").map((port) => (
                  <option key={port} value={port}>
                    {port}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600">Loading vessels...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedVessels.map((vessel) => (
              <div
                key={vessel.id}
                onClick={() => handleVesselSelect(vessel)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getVesselIcon(vessel.type)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vessel.name}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        vessel.status
                      )}`}
                    >
                      {vessel.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-2" />
                      <span>
                        {vessel.loadType} - {vessel.loadTons.toLocaleString()}{" "}
                        tons
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {vessel.arrivedTo} → {vessel.nextDestination}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {formatTimeLeft(vessel.timeLeftMinutes)} remaining
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Arrived: {formatDate(vessel.arrivalTime.toString())}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Capacity</span>
                      <span className="font-medium text-gray-900">
                        {vessel.capacityTons.toLocaleString()} tons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (vessel.loadTons / vessel.capacityTons) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
