import { z } from "zod";

const nonEmptyOptional = z
  .string()
  .trim()
  .transform((v) => (v.length > 0 ? v : undefined))
  .optional();

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().trim().url().default("http://localhost:3000"),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: nonEmptyOptional,
  NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: z.string().trim().min(1).default("DEMO_MAP_ID"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: nonEmptyOptional,
});

const serverEnvSchema = z.object({
  GOOGLE_MAPS_SERVER_API_KEY: nonEmptyOptional,
  SUPABASE_SERVICE_ROLE_KEY: nonEmptyOptional,
  REPORT_IP_SALT: nonEmptyOptional,
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Read and validate public client environment variables without throwing during CI builds. */
export function getPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

/** Read and validate server-only secrets lazily inside Route Handlers. */
export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    GOOGLE_MAPS_SERVER_API_KEY: process.env.GOOGLE_MAPS_SERVER_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    REPORT_IP_SALT: process.env.REPORT_IP_SALT,
  });
}

/** Return boolean availability flags without exposing secret or key values. */
export function getServiceConfigFlags() {
  const pub = getPublicEnv();
  const srv = getServerEnv();

  return {
    googleMapsPublic: Boolean(pub.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    googleMapsServer: Boolean(srv.GOOGLE_MAPS_SERVER_API_KEY),
    supabasePublic: Boolean(pub.NEXT_PUBLIC_SUPABASE_URL && pub.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServer: Boolean(pub.NEXT_PUBLIC_SUPABASE_URL && srv.SUPABASE_SERVICE_ROLE_KEY),
  };
}
