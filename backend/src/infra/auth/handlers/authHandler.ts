import { AuthService } from "@/core/auth/application/services/authService";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  OnboardingRequest,
  onboardingRequestSchema,
} from "../schemas/auth.schemas";

export class AuthHandler {
  constructor(private readonly authService: AuthService) {}

  async registerBusiness(request: FastifyRequest, reply: FastifyReply) {
    const { businessName } = await onboardingRequestSchema.parseAsync(
      request.body,
    );
    const { id: userId, email } = request.user;

    const result = await this.authService.registerBusiness(
      businessName,
      userId,
      email,
    );

    return reply.code(201).send(result);
  }
}
