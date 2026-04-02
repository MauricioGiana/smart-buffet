import Fastify from "fastify";
import sensible from "@fastify/sensible";

const app = Fastify({
  logger: true,
});

app.register(sensible);

app.get("/health", async () => {
  return { status: "ok", service: "smart-buffet-api" };
});

const start = async (): Promise<void> => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = "0.0.0.0";

    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
