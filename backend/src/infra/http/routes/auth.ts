import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaUnitOfWork } from "../../shared/adapters/prismaUnitOfWork";
import { PrismaUserRepository } from "../../auth/repositories/prismaUserRepository";
import { PrismaTenantRepository } from "../../auth/repositories/prismaTenantRepository";
import { PrismaMemberRepository } from "../../auth/repositories/prismaMemberRepository";
import { RegisterBusinessUseCase } from "../../../core/auth/application/useCases/registerBusiness";
import { onboardingRequestSchema } from "../schemas/auth";
import { clientAuth } from "../middleware/clientAuth";
import { env } from "../../config/env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const unitOfWork = new PrismaUnitOfWork(prisma);
const userRepository = new PrismaUserRepository(prisma);
const tenantRepository = new PrismaTenantRepository(prisma);
const memberRepository = new PrismaMemberRepository(prisma);

const registerBusinessUseCase = new RegisterBusinessUseCase(
  unitOfWork,
  userRepository,
  tenantRepository,
  memberRepository,
  env.ALLOWED_EMAILS,
);

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/onboarding",
    {
      preHandler: clientAuth,
      schema: {
        body: onboardingRequestSchema,
      },
    },
    async (request, reply) => {
      const { businessName } = request.body as { businessName: string };
      const { id: userId, email } = request.user;

      try {
        const result = await registerBusinessUseCase.execute(
          businessName,
          userId,
          email,
        );
        return reply.code(201).send(result);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Email not allowed for registration"
        ) {
          return reply.code(403).send({ error: error.message });
        }
        throw error; // Let Fastify handle other errors
      }
    },
  );
}
