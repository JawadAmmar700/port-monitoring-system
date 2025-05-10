import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { auth } from "@/server/auth";
import { Parser } from "json2csv";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data } = await request.json();
    if (!data || !Array.isArray(data)) {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    // Define the fields for the CSV
    const fields = [
      "timestamp",
      "temperature",
      "humidity",
      "co2",
      "no2",
      "so2",
      "pm25",
      "ph",
      "dissolved_oxygen",
      "oil_spill_detected",
      "noise_level",
      "latitude",
      "longitude",
      "sensor_id",
    ];

    // Create CSV parser with the defined fields
    const json2csvParser = new Parser({ fields });

    // Convert the data to CSV
    const csv = json2csvParser.parse(data);

    // Create the response with the CSV data
    const response = new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="environmental-data.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error in export route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
