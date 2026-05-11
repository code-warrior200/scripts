import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getDemoAuthUser } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: email || "demo@example.com" },
      include: {
        organization: true,
        subscriptions: {
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const demoUser = getDemoAuthUser(email);

    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            organization: user.organization,
            organizationId: user.organizationId,
            role: user.role,
          }
        : demoUser,
      subscription: user?.subscriptions[0]
        ? {
            plan: user.subscriptions[0].plan,
            status: user.subscriptions[0].status,
          }
        : { plan: "pro", status: "active" },
    });
  } catch {
    const demoUser = getDemoAuthUser();

    return NextResponse.json({
      user: demoUser,
      subscription: { plan: "pro", status: "active" },
    });
  }
}
