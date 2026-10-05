import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

// Upstash sozlanmagan bo'lsa null qaytaradi — sayt Redis'siz ham ishlaydi
export function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}
