import React from "react";

const SystemOverviewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Port Information Section */}
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm border border-blue-100">
          <h3 className="text-2xl font-bold mb-6 text-blue-800">
            Port Environmental Monitoring System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-blue-700">
                System Overview
              </h4>
              <p className="text-gray-700 mb-6 leading-relaxed">
                This real-time environmental monitoring system tracks critical
                parameters across the port area to ensure compliance with
                environmental regulations and maintain optimal operating
                conditions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Continuous monitoring of air and water quality
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Real-time data collection and analysis
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Automated alerts for threshold violations
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Historical data tracking and reporting
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-blue-700">
                Monitoring Parameters & Guidelines
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h5 className="font-semibold text-blue-600 mb-3">
                    Air Quality
                  </h5>
                  <ul className="space-y-3">
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">CO2:</span>
                      <div className="text-gray-600">Ideal: &lt;1000 ppm</div>
                      <div className="text-red-500 text-xs">
                        Action: Ventilate if &gt;1500 ppm
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">NO2:</span>
                      <div className="text-gray-600">Safe: &lt;100 ppb</div>
                      <div className="text-red-500 text-xs">
                        Action: Reduce operations if &gt;200 ppb
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">PM2.5:</span>
                      <div className="text-gray-600">Safe: &lt;35 µg/m³</div>
                      <div className="text-red-500 text-xs">
                        Action: Dust control if &gt;50 µg/m³
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">SO2:</span>
                      <div className="text-gray-600">Safe: &lt;75 ppb</div>
                      <div className="text-red-500 text-xs">
                        Action: Review fuel if &gt;100 ppb
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h5 className="font-semibold text-blue-600 mb-3">
                    Water Quality
                  </h5>
                  <ul className="space-y-3">
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">pH:</span>
                      <div className="text-gray-600">Ideal: 6.5-8.5</div>
                      <div className="text-red-500 text-xs">
                        Action: Investigate if &lt;6.0 or &gt;9.0
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Dissolved Oxygen:
                      </span>
                      <div className="text-gray-600">Healthy: &gt;5 mg/L</div>
                      <div className="text-red-500 text-xs">
                        Action: Aeration if &lt;3 mg/L
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Oil Spill:
                      </span>
                      <div className="text-gray-600">Zero tolerance</div>
                      <div className="text-red-500 text-xs">
                        Action: Immediate containment
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h5 className="font-semibold text-blue-600 mb-3">
                    Environmental
                  </h5>
                  <ul className="space-y-3">
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Temperature:
                      </span>
                      <div className="text-gray-600">Optimal: 15-30°C</div>
                      <div className="text-red-500 text-xs">
                        Action: Cooling if &gt;35°C
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Humidity:
                      </span>
                      <div className="text-gray-600">Comfortable: 40-60%</div>
                      <div className="text-red-500 text-xs">
                        Action: Dehumidify if &gt;80%
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">Noise:</span>
                      <div className="text-gray-600">Safe: &lt;85 dB</div>
                      <div className="text-red-500 text-xs">
                        Action: Hearing protection if &gt;90 dB
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h5 className="font-semibold text-blue-600 mb-3">
                    Operational Guidelines
                  </h5>
                  <ul className="space-y-3">
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Real-time Updates:
                      </span>
                      <div className="text-gray-600">Continuous monitoring</div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Response Time:
                      </span>
                      <div className="text-gray-600">
                        Immediate action for critical alerts
                      </div>
                    </li>
                    <li className="text-sm">
                      <span className="font-medium text-gray-800">
                        Documentation:
                      </span>
                      <div className="text-gray-600">
                        50-point history maintained
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Response Section */}
        <div className="mt-8 bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl shadow-sm border border-red-100">
          <h4 className="text-xl font-semibold mb-4 text-red-700">
            Emergency Response Protocol
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h5 className="font-semibold text-red-600 mb-3">
                Air Quality Emergency
              </h5>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Evacuate affected area
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Activate ventilation systems
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Notify emergency response team
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h5 className="font-semibold text-red-600 mb-3">
                Water Quality Emergency
              </h5>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Stop all water operations
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Deploy containment measures
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Initiate cleanup procedures
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h5 className="font-semibold text-red-600 mb-3">
                Environmental Emergency
              </h5>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Assess immediate danger
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Implement safety measures
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Contact relevant authorities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverviewPage;
