import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaUnitOfWork } from "@/infra/shared/prismaUnitOfWork";
import { PrismaUserRepository } from "@/infra/auth/repositories/prismaUserRepository";
import { PrismaTenantRepository } from "@/infra/auth/repositories/prismaTenantRepository";
import { PrismaMemberRepository } from "@/infra/auth/repositories/prismaMemberRepository";
import { AuthService } from "@/core/auth/application/services/authService";
import { clientAuth } from "@/api/middleware/clientAuth";
import { env } from "@/api/config/env";
import { AuthHandler } from "@/infra/auth/handlers/authHandler";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const unitOfWork = new PrismaUnitOfWork(prisma);
const userRepository = new PrismaUserRepository(prisma);
const tenantRepository = new PrismaTenantRepository(prisma);
const memberRepository = new PrismaMemberRepository(prisma);

const authService = new AuthService(
  unitOfWork,
  userRepository,
  tenantRepository,
  memberRepository,
  env.ALLOWED_EMAILS,
);

const authHandler = new AuthHandler(authService);

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/onboarding", { preHandler: clientAuth }, (request, reply) =>
    authHandler.registerBusiness(request, reply),
  );
}
