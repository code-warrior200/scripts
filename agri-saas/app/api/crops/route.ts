import { NextResponse } from "next/server";
import { getCrops } from "../../../lib/data";

export async function GET() {
  return NextResponse.json({ crops: getCrops() });
}
