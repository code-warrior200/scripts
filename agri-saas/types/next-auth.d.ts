import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';

declare module '@prisma/client' {
  interface User {
    role: UserRole;
    organizationId: string | null;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      organizationId: string | null;
      organization?: {
        id: string;
        name: string;
        slug: string;
        plan: string;
      } | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
    organizationId: string | null;
    organization?: {
      id: string;
      name: string;
      slug: string;
      plan: string;
    } | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    organizationId: string | null;
    organization?: {
      id: string;
      name: string;
      slug: string;
      plan: string;
    } | null;
  }
}