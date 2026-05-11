import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: true,
        subscriptions: {
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: user.organization,
        organizationId: user.organizationId,
        role: user.role,
      },
      subscription: user.subscriptions[0]
        ? {
            plan: user.subscriptions[0].plan,
            status: user.subscriptions[0].status,
          }
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch user." },
      { status: 500 }
    );
  }
}
