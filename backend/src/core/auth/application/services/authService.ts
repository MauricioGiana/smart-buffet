import { randomUUID } from "crypto";
import { UnitOfWork } from "@/core/shared/unitOfWork";
import { UserRepository } from "@core/auth/domain/repositories/userRepository";
import { TenantRepository } from "@core/auth/domain/repositories/tenantRepository";
import { MemberRepository } from "@core/auth/domain/repositories/memberRepository";
import { User } from "@core/auth/domain/entities/user";
import { Tenant } from "@core/auth/domain/entities/tenant";
import { Member, MEMBER_ROLE } from "@core/auth/domain/entities/member";

export class AuthService {
  constructor(
    private unitOfWork: UnitOfWork,
    private userRepository: UserRepository,
    private tenantRepository: TenantRepository,
    private memberRepository: MemberRepository,
    private allowedEmails: string[],
  ) {}

  async registerBusiness(
    businessName: string,
    userId: string,
    email: string,
  ): Promise<{ tenantId: string; userId: string; memberId: string }> {
    // Validate email is in white-list
    if (!this.allowedEmails.includes(email)) {
      throw new Error("Email not allowed for registration");
    }

    const tenant = new Tenant({ name: businessName });
    const user = new User({ email }); // Assuming fullName not provided yet
    const member = new Member({
      userId: user.id,
      tenantId: tenant.id,
      role: MEMBER_ROLE.OWNER,
    });

    await this.unitOfWork.runInTransaction(async (tx) => {
      await this.userRepository.create(user, tx);
      await this.tenantRepository.create(tenant, tx);
      await this.memberRepository.create(member, tx);
    });

    return { tenantId: tenant.id, userId: user.id, memberId: member.id };
  }
}
