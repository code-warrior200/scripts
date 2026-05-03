import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { plan?: string };
    const plan = body.plan?.trim();

    if (!plan) {
      return NextResponse.json({ success: false, error: "Plan is required." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Subscription updated to ${plan}.`,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to update subscription." }, { status: 400 });
  }
}
