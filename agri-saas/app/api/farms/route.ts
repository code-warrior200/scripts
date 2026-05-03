import { NextResponse } from "next/server";
import { addFarm, getFarms } from "../../../lib/data";

export async function GET() {
  return NextResponse.json({ farms: getFarms() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      region?: string;
      status?: string;
      crops?: string[];
    };

    const name = body.name?.trim();
    const region = body.region?.trim();
    const status = body.status?.trim() || "Healthy";
    const crops = Array.isArray(body.crops) ? body.crops.map((crop) => crop.trim()).filter(Boolean) : [];

    if (!name || !region) {
      return NextResponse.json({ error: "Farm name and region are required." }, { status: 400 });
    }

    const farm = addFarm({ name, region, status, crops });

    return NextResponse.json({ farm }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to add farm." }, { status: 400 });
  }
}
