import { PrismaClient } from "@prisma/client";
import { UnitOfWork } from "../../core/shared/unitOfWork";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private prisma: PrismaClient) {}

  async runInTransaction<T>(operation: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(operation);
  }
}
