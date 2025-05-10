import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { auth } from "@/server/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new NextResponse("Missing date range parameters", { status: 400 });
    }

    // Fetch data from your backend service
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/environmental/data/historical?startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch historical data");
    }

    const data = await response.json();
    console.log("data", data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
