export class Member {
  id: string;
  tenantId: string;
  userId: string;
  role: MEMBER_ROLE;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: MemberPayload) {
    this.id = data.id ?? crypto.randomUUID();
    this.tenantId = data.tenantId;
    this.userId = data.userId;
    this.role = data.role;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}

export type MemberPayload = {
  id?: string;
  tenantId: string;
  userId: string;
  role: MEMBER_ROLE;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum MEMBER_ROLE {
  OWNER = "owner",
  ADMIN = "admin",
}
