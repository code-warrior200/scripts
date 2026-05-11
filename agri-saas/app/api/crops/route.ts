import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const farmId = searchParams.get("farmId");

    let whereClause: any = undefined;

    if (farmId) {
      // Only allow crops for farms owned by the current user
      const farm = await prisma.farm.findUnique({
        where: { id: farmId },
        select: { id: true, ownerId: true },
      });

      if (!farm) {
        return NextResponse.json({ error: "Farm not found." }, { status: 404 });
      }
      if (farm.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      whereClause = {
        farmCrops: {
          some: { id: farmId },
        },
      };
    } else {
      // No farmId: list crops for all farms owned by current user
      const userFarms = await prisma.farm.findMany({
        where: { ownerId: session.user.id },
        select: { id: true },
      });

      const farmIds = userFarms.map((f: { id: string }) => f.id);
      whereClause = {
        farmCrops: {
          some: { id: { in: farmIds } },
        },
      };
    }

    const crops = await prisma.crop.findMany({
      where: whereClause,
      include: {
        farmCrops: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ crops });
  } catch (error) {
    console.error("Get crops error:", error);
    return NextResponse.json({ error: "Unable to fetch crops." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      variety?: string;
      area?: string;
      growthStage?: string;
      plantingDate?: string;
      harvestWindow?: string;
      health?: string;
      nextAction?: string;
      farmId?: string;
    };

    const name = body.name?.trim();
    const variety = body.variety?.trim() || "Not specified";
    const area = body.area?.trim() || "Not set";
    const growthStage = body.growthStage?.trim() || "Not set";
    const plantingDate = body.plantingDate?.trim() || "Not set";
    const harvestWindow = body.harvestWindow?.trim() || "Not set";
    const health = body.health?.trim() || "Stable";
    const nextAction = body.nextAction?.trim() || "None";
    const farmId = body.farmId?.trim();

    if (!name) {
      return NextResponse.json({ error: "Crop name is required." }, { status: 400 });
    }

    if (!farmId) {
      return NextResponse.json({ error: "Farm ID is required." }, { status: 400 });
    }

    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      select: { id: true, ownerId: true, organizationId: true },
    });

    if (!farm) {
      return NextResponse.json({ error: "Farm not found." }, { status: 404 });
    }

    if (farm.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const crop = await prisma.crop.create({
      data: {
        name,
        variety,
        // NOTE: Crop model in schema does NOT have fields: area, growthStage, plantingDate, harvestWindow, health, nextAction.
        // Keeping these as-is would break at runtime/compile. We store only fields defined in schema.
        // If these fields are meant for CropCycle, those should be created in a different endpoint.
        // For now, map "variety" and ignore the rest.
        organizationId: farm.organizationId,
        farmCrops: { connect: { id: farmId } },
      },
      include: {
        farmCrops: true,
      },
    });

    // If clients expect a specific shape, return the submitted metadata as part of response (non-persistent).
    return NextResponse.json(
      {
        crop,
        meta: { area, growthStage, plantingDate, harvestWindow, health, nextAction },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create crop error:", error);
    return NextResponse.json({ error: "Unable to create crop." }, { status: 500 });
  }
}
