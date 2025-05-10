"use client";

import { useState } from "react";
import VesselTable from "@/components/VesselTable";
import VesselDetails from "@/components/VesselDetails";
import { Vessel } from "@/types/vessel";

export default function VesselsPage() {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vessels</h1>

      <div className="relative">
        <VesselTable onVesselSelect={setSelectedVessel} />
        {selectedVessel && (
          <VesselDetails
            vessel={selectedVessel}
            onClose={() => setSelectedVessel(null)}
          />
        )}
      </div>
    </div>
  );
}
