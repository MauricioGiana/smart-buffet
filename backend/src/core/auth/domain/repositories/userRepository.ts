import { User } from "../entities/user";

export interface UserRepository {
  create(user: User, tx?: any): Promise<void>;
}
