import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import { upstashRedis, vercel } from "@t3-oss/env-core/presets-zod";

export const env = createEnv({
  extends: [
    vercel(),
    upstashRedis()
  ],
  server: {
    // Discourse
    DISCOURSE_BOT_TOKEN: z.string().min(1),
    DISCOURSE_SIGNING_SECRET: z.string().min(1),
    DISCOURSE_URL: z.string().url().min(1),
    // AI
    OPENAI_API_KEY: z.string().optional(),
    HACKCLUB_API_KEY: z.string().optional(),
    OPENROUTER_API_KEY: z.string().optional(),
    // Logging
    LOG_DIRECTORY: z.string().optional().default('logs'),
    LOG_LEVEL: z
      .enum(['debug', 'info', 'warn', 'error'])
      .optional()
      .default('info'),
    // Mem0
    MEM0_API_KEY: z.string().min(1).startsWith('m0-'),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
