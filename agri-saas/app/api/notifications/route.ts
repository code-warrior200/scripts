import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      irrigation?: boolean;
      harvest?: boolean;
      inventory?: boolean;
      delivery?: string;
    };

    if (!body.delivery?.trim()) {
      return NextResponse.json({ success: false, error: "Delivery method is required." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated.",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to update notifications." }, { status: 400 });
  }
}
