import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          organizationId: user.organizationId,
          organization: user.organization,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.organization = user.organization;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
        session.user.organization = token.organization as typeof session.user.organization;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          const defaultOrg = await prisma.organization.create({
            data: {
              name: `${user.name}'s Farm`,
              slug: `${user.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
              plan: 'free',
              maxUsers: 1,
              maxFarms: 3,
            },
          });

          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || 'User',
              image: user.image,
              role: UserRole.ADMIN,
              organizationId: defaultOrg.id,
              emailVerified: new Date(),
            },
          });
        }

        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCurrentUser(session?: { user?: { id?: string } }) {
  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: true,
    },
  });
}

export function hasPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS[UserRole]) {
  return ROLE_PERMISSIONS[role][permission];
}

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageFarms: true,
    canManageCrops: true,
    canManageInventory: true,
    canManageTasks: true,
    canViewAnalytics: true,
    canManageSubscription: true,
    readOnly: false,
  },
  [UserRole.FARM_MANAGER]: {
    canManageUsers: false,
    canManageFarms: true,
    canManageCrops: true,
    canManageInventory: true,
    canManageTasks: true,
    canViewAnalytics: true,
    canManageSubscription: false,
    readOnly: false,
  },
  [UserRole.STAFF]: {
    canManageUsers: false,
    canManageFarms: false,
    canManageCrops: false,
    canManageInventory: false,
    canManageTasks: true,
    canViewAnalytics: false,
    canManageSubscription: false,
    readOnly: false,
  },
  [UserRole.VIEWER]: {
    canManageUsers: false,
    canManageFarms: false,
    canManageCrops: false,
    canManageInventory: false,
    canManageTasks: false,
    canViewAnalytics: false,
    canManageSubscription: false,
    readOnly: true,
  },
};

export function requireAuth(handler: (req: Request, context: { params: Record<string, string> }) => Promise<Response>) {
  return async (req: Request, context: { params: Record<string, string> }) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    return handler(req, context);
  };
}

export async function createOrganizationForUser(
  userId: string,
  organizationName: string
) {
  const slug = `${organizationName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  const organization = await prisma.organization.create({
    data: {
      name: organizationName,
      slug,
      plan: 'free',
      maxUsers: 1,
      maxFarms: 3,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      organizationId: organization.id,
      role: UserRole.ADMIN,
    },
  });

  await prisma.subscription.create({
    data: {
      plan: 'free',
      status: 'active',
      userId,
      organizationId: organization.id,
    },
  });

  return organization;
}

export async function getUserOrganization(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organization: true,
    },
  });

  return user?.organization ?? null;
}

export async function inviteUserToOrganization(
  organizationId: string,
  invitedById: string,
  email: string,
  role: UserRole
) {
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return prisma.organizationInvitation.create({
    data: {
      email,
      role,
      token,
      organizationId,
      invitedById,
      expiresAt,
    },
  });
}

export async function acceptInvitation(token: string, userId: string) {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invitation || invitation.status !== 'pending') {
    throw new Error('Invalid or expired invitation');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('Invitation has expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email !== invitation.email) {
    throw new Error('Invitation email does not match user email');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      organizationId: invitation.organizationId,
      role: invitation.role,
    },
  });

  await prisma.organizationInvitation.update({
    where: { id: invitation.id },
    data: { status: 'accepted' },
  });

  return invitation.organization;
}
