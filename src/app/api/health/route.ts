import { NextResponse } from "next/server";
import { createHealthResponse } from "@/lib/deployment/deploymentMetadata";

export function GET() {
  return NextResponse.json(createHealthResponse());
}
