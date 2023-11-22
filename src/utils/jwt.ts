import { now } from '@vueuse/core';
import { Base64 } from 'js-base64';

export { decodeJwtPayload };

type JwtPayload = { name?: string; exp?: number };

function decodeJwtPayload(jwt: string): JwtPayload | null {
  let m = jwt.trim().match(/^([0-9a-zA-Z\+\-]+)\.([0-9a-zA-Z\+\-]+)\.([0-9a-zA-Z\+\-]+)/);
  if (!m) return null;
  let payload = JSON.parse(Base64.decode(m[2]));
  if (payload?.exp < now() / 1000) return null;
  return payload;
}
