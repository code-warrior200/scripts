import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      organization?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const organization = body.organization?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Validation
    if (!name || !organization || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Create default organization and link to user
    const org = await prisma.organization.create({
      data: {
        name: organization,
        slug: `${organization.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        plan: 'free',
        maxUsers: 1,
        maxFarms: 3,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { organizationId: org.id },
    });

    // Create default subscription
    await prisma.subscription.create({
      data: {
        plan: "free",
        status: "active",
        userId: user.id,
      },
    });

    // Return user data (excluding password)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          organization: user.organization,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 }
    );
  }
}