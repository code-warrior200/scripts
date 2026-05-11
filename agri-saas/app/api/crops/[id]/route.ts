import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const crop = await prisma.crop.findUnique({
      where: { id: params.id },
      include: {
        farm: true,
      },
    });

    if (!crop) {
      return NextResponse.json(
        { error: "Crop not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ crop });
  } catch (error) {
    console.error("Get crop error:", error);
    return NextResponse.json(
      { error: "Unable to fetch crop." },
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
      variety?: string;
      area?: string;
      growthStage?: string;
      plantingDate?: string;
      harvestWindow?: string;
      health?: string;
      nextAction?: string;
    };

    // Check if crop exists
    const existingCrop = await prisma.crop.findUnique({
      where: { id: params.id },
    });

    if (!existingCrop) {
      return NextResponse.json(
        { error: "Crop not found." },
        { status: 404 }
      );
    }

    const crop = await prisma.crop.update({
      where: { id: params.id },
      data: {
        name: body.name?.trim(),
        variety: body.variety?.trim(),
        area: body.area?.trim(),
        growthStage: body.growthStage?.trim(),
        plantingDate: body.plantingDate?.trim(),
        harvestWindow: body.harvestWindow?.trim(),
        health: body.health?.trim(),
        nextAction: body.nextAction?.trim(),
      },
      include: {
        farm: true,
      },
    });

    return NextResponse.json({ crop });
  } catch (error) {
    console.error("Update crop error:", error);
    return NextResponse.json(
      { error: "Unable to update crop." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if crop exists
    const existingCrop = await prisma.crop.findUnique({
      where: { id: params.id },
    });

    if (!existingCrop) {
      return NextResponse.json(
        { error: "Crop not found." },
        { status: 404 }
      );
    }

    await prisma.crop.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Crop deleted successfully." });
  } catch (error) {
    console.error("Delete crop error:", error);
    return NextResponse.json(
      { error: "Unable to delete crop." },
      { status: 400 }
    );
  }
}