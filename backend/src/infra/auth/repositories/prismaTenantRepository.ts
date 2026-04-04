import { PrismaClient } from "@prisma/client";
import { TenantRepository } from "@core/auth/domain/repositories/tenantRepository";
import { Tenant } from "@core/auth/domain/entities/tenant";

export class PrismaTenantRepository implements TenantRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    tenant: Tenant,
    client: PrismaClient = this.prisma,
  ): Promise<void> {
    await client.tenant.create({
      data: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        status: tenant.status,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
    });
  }
}
