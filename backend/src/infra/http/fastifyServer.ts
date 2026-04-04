import Fastify from "fastify";
import { env } from "../config/env";
import sensible from "@fastify/sensible";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { authRoutes } from "./routes/auth";

const app = Fastify({ logger: true });

app.register(sensible);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(authRoutes);

app.get("/health", async (_request, _reply) => {
  return { status: "ok", service: "smart-buffet-api" };
});

const start = async (): Promise<void> => {
  const port = Number(env.PORT ?? 3000);
  const host = "0.0.0.0";

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
