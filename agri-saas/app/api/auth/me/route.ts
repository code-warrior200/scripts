import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    // Get email from query parameter (for now, will be replaced with session)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        subscriptions: {
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: user.organization,
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