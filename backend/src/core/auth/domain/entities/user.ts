export class User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: UserPayload) {
    this.id = data.id ?? crypto.randomUUID();
    this.email = data.email;
    this.fullName = data.fullName;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}

export type UserPayload = {
  id?: string;
  email: string;
  fullName?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
