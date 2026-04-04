import { PrismaClient } from "@prisma/client";
import { MemberRepository } from "@core/auth/domain/repositories/memberRepository";
import { Member } from "@core/auth/domain/entities/member";

export class PrismaMemberRepository implements MemberRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    member: Member,
    client: PrismaClient = this.prisma,
  ): Promise<void> {
    await client.member.create({
      data: {
        id: member.id,
        tenantId: member.tenantId,
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    });
  }
}
