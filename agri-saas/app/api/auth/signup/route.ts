import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

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

    const slugBase = organization
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { user, org } = await prisma.$transaction(async (tx) => {
      const createdOrg = await tx.organization.create({
        data: {
          name: organization,
          slug: `${slugBase || "farm"}-${Date.now()}`,
          plan: "free",
          maxUsers: 1,
          maxFarms: 3,
        },
      });

      const createdUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: UserRole.ADMIN,
          organizationId: createdOrg.id,
        },
      });

      await tx.subscription.create({
        data: {
          plan: "free",
          status: "active",
          userId: createdUser.id,
          organizationId: createdOrg.id,
        },
      });

      return { user: createdUser, org: createdOrg };
    });

    // Return user data (excluding password)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          organization: org,
          organizationId: org.id,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 }
    );
  }
}
