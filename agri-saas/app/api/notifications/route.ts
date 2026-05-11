import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Unable to fetch notifications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      message?: string;
      type?: string;
      userId?: string;
    };

    const title = body.title?.trim();
    const message = body.message?.trim();
    const type = body.type?.trim() || "info";
    const userId = body.userId;

    if (!title || !message || !userId) {
      return NextResponse.json(
        { error: "Title, message, and user ID are required." },
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

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { error: "Unable to create notification." },
      { status: 400 }
    );
  }
}