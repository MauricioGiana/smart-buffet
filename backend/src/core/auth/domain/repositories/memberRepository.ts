import { Member } from "../entities/member";

export interface MemberRepository {
  create(member: Member, tx?: any): Promise<void>;
}
