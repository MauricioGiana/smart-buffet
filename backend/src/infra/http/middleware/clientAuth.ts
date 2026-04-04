import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";

export interface AuthUser {
  id: string;
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }
}

export async function clientAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply
      .code(401)
      .send({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.substring(7);

  try {
    const secret = env.SUPABASE_JWT_SECRET;

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.sub || !decoded.email) {
      throw new Error("Invalid token payload");
    }

    request.user = {
      id: decoded.sub,
      email: decoded.email,
    };
  } catch (error) {
    return reply.code(401).send({ error: "Invalid token" });
  }
}
