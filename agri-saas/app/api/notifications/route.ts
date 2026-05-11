import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NotificationType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch notifications." },
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

    const body = (await request.json()) as {
      title?: string;
      message?: string;
      type?: string;
      irrigation?: boolean;
      harvest?: boolean;
      inventory?: boolean;
      delivery?: string;
    };

    const isPreferenceUpdate =
      typeof body.irrigation === "boolean" ||
      typeof body.harvest === "boolean" ||
      typeof body.inventory === "boolean" ||
      typeof body.delivery === "string";

    const title = body.title?.trim() || (isPreferenceUpdate ? "Notification preferences updated" : "");
    const message =
      body.message?.trim() ||
      (isPreferenceUpdate
        ? `Alerts will be delivered via ${body.delivery || "Email"}.`
        : "");
    const requestedType = body.type?.trim().toUpperCase();
    const type = requestedType && requestedType in NotificationType
      ? (requestedType as NotificationType)
      : NotificationType.SYSTEM;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required." },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create notification." },
      { status: 400 }
    );
  }
}
