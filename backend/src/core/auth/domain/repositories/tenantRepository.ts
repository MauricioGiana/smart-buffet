import { Tenant } from "../entities/tenant";

export interface TenantRepository {
  create(tenant: Tenant, tx?: any): Promise<void>;
}
