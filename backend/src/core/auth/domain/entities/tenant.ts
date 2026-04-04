export class Tenant {
  id: string;
  name: string;
  slug: string;
  plan?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TenantPayload) {
    this.id = data.id ?? crypto.randomUUID();
    this.name = data.name;
    this.slug = data.slug ?? this.generateSlug(data.name);
    this.plan = data.plan;
    this.status = data.status;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

export type TenantPayload = {
  id?: string;
  name: string;
  slug?: string;
  plan?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
