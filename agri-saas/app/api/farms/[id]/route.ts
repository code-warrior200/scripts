import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const farm = await prisma.farm.findUnique({
      where: { id: params.id },
      include: {
        crops: true,
      },
    });

    if (!farm) {
      return NextResponse.json(
        { error: "Farm not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ farm });
  } catch (error) {
    console.error("Get farm error:", error);
    return NextResponse.json(
      { error: "Unable to fetch farm." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as {
      name?: string;
      region?: string;
      status?: string;
      manager?: string;
      area?: string;
      soilType?: string;
      lastInspection?: string;
    };

    // Check if farm exists
    const existingFarm = await prisma.farm.findUnique({
      where: { id: params.id },
    });

    if (!existingFarm) {
      return NextResponse.json(
        { error: "Farm not found." },
        { status: 404 }
      );
    }

    const farm = await prisma.farm.update({
      where: { id: params.id },
      data: {
        name: body.name?.trim(),
        region: body.region?.trim(),
        status: body.status?.trim(),
        manager: body.manager?.trim(),
        area: body.area?.trim(),
        soilType: body.soilType?.trim(),
        lastInspection: body.lastInspection?.trim(),
      },
      include: {
        crops: true,
      },
    });

    return NextResponse.json({ farm });
  } catch (error) {
    console.error("Update farm error:", error);
    return NextResponse.json(
      { error: "Unable to update farm." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if farm exists
    const existingFarm = await prisma.farm.findUnique({
      where: { id: params.id },
    });

    if (!existingFarm) {
      return NextResponse.json(
        { error: "Farm not found." },
        { status: 404 }
      );
    }

    await prisma.farm.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Farm deleted successfully." });
  } catch (error) {
    console.error("Delete farm error:", error);
    return NextResponse.json(
      { error: "Unable to delete farm." },
      { status: 400 }
    );
  }
}