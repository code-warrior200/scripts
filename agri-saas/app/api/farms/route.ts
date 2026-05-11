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

    const farms = await prisma.farm.findMany({
      where: { ownerId: session.user.id },
      include: {
        crops: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ farms });
  } catch {
    return NextResponse.json({ error: "Unable to fetch farms." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      region?: string;
      status?: string;
    };

    const name = body.name?.trim();
    const region = body.region?.trim();
    const status = body.status?.trim() || "active";

    if (!name || !region) {
      return NextResponse.json(
        { error: "Farm name and region are required." },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        region,
        status,
        organizationId: session.user.organizationId,
        ownerId: session.user.id,
      },
      include: {
        crops: true,
      },
    });

    return NextResponse.json({ farm }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create farm." }, { status: 500 });
  }
}
