import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      plan?: string;
      userId?: string;
    };

    const plan = body.plan?.trim();
    const userId = body.userId;

    if (!plan) {
      return NextResponse.json(
        { error: "Plan is required." },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Deactivate existing subscriptions
    await prisma.subscription.updateMany({
      where: { userId, status: "active" },
      data: { status: "inactive" },
    });

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        plan,
        status: "active",
        userId,
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
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update subscription." },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: "active" },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    return NextResponse.json({
      subscription: subscriptions[0] || null,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Unable to fetch subscription." },
      { status: 500 }
    );
  }
}