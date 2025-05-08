import EnvironmentalDashboard from "@/components/EnvironmentalDashboard";

export default function DashboardPage() {
  // Select the first sensor by default

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1">
          <div>
            <EnvironmentalDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
