import { PrismaClient } from "@prisma/client";
import { UserRepository } from "@core/auth/domain/repositories/userRepository";
import { User } from "@core/auth/domain/entities/user";

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: User, client: PrismaClient = this.prisma): Promise<void> {
    await client.user.create({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
}
