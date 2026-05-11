import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
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
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password (password is required for credentials login)
    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid login method. Please use Google sign-in." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
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
      { error: "Unable to log in." },
      { status: 500 }
    );
  }
}