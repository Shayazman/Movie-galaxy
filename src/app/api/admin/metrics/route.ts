import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    metrics: [
      { label: "Subscribers", value: "-" },
      { label: "Premium Users", value: "-" },
      { label: "Today Visits", value: "-" },
      { label: "Trailer Plays", value: "-" },
    ],
  });
}

