import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

const VALID_PLANS = ["free", "pro", "enterprise"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id, status: "active" },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    return NextResponse.json({ subscription: subscriptions[0] ?? null });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch subscription." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { plan?: string };
    const plan = body.plan?.trim().toLowerCase();

    if (!plan) {
      return NextResponse.json({ error: "Plan is required." }, { status: 400 });
    }

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    await prisma.subscription.updateMany({
      where: { userId: session.user.id, status: "active" },
      data: { status: "cancelled" },
    });

    const subscription = await prisma.subscription.create({
      data: {
        plan,
        status: "active",
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Subscription updated to ${plan}.`,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to update subscription." },
      { status: 400 }
    );
  }
}
