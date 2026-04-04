import { z } from "zod";

const envSchema = z.object({
  // Node
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url(),

  // Supabase (Auth)
  SUPABASE_JWT_SECRET: z.string().min(10),
  SUPABASE_URL: z.string().url(),

  // App Logic
  ALLOWED_EMAILS: z.string().transform((str) =>
    str
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0),
  ),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
