import { NextResponse } from "next/server";
import { createReadinessResponse } from "@/lib/deployment/deploymentMetadata";

export function GET() {
  return NextResponse.json(createReadinessResponse());
}
