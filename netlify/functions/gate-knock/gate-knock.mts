import { Context } from "@netlify/functions";
import { utils, server } from "@passwordless-id/webauthn";
import { kv } from "@vercel/kv";
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";

const expiredTime = parseInt(process.env.JWT_EXPIRED_TIME ?? "0");

function notFound() {
  return new Response(null, { status: 404 });
}

function get_jwt(user: string) {
  let token = jwt.sign(
    { user: user, nonce: utils.randomChallenge() },
    process.env.JWT_PRIVATE_KEY!,
    { expiresIn: expiredTime }
  );
  return token;
}

async function start(user: string, req: Request, context: Context) {
  let res =
    await sql`SELECT json_agg(id) FROM gate WHERE name = ${user} AND enabled = TRUE`;
  let id: string[] = res.rows[0].json_agg;
  if ((id?.length ?? 0) == 0) {
    console.log(`invalid user=${user}`);
    return notFound();
  }
  let challenge = utils.randomChallenge();
  let key = `gate/challenge/${user}`;
  await kv.set(key, challenge);
  await kv.expire(key, 60);
  return new Response(
    JSON.stringify({
      challenge: challenge,
      id: id,
    })
  );
}

async function verify(user: string, req: Request, context: Context) {
  let challenge: string | null = await kv.get(`gate/challenge/${user}`);
  if (!challenge) {
    console.log(`challenge for ${user} not found`);
    return notFound();
  }
  await kv.del(`gate/challenge/${user}`);
  let authentication = await req.json();
  let query =
    await sql`SELECT * FROM gate WHERE id = ${authentication.credentialId} LIMIT 1`;
  if (query.rowCount == 0) {
    console.log("credential ID not found");
    return notFound();
  }
  if (user != query.rows[0].name) {
    console.log("name not matched");
    return notFound();
  }
  const credentialKey = {
    id: query.rows[0].id,
    publicKey: query.rows[0].publickey,
    algorithm: query.rows[0].algorithm,
  };

  const expected = {
    challenge: challenge,
    origin: context.site.url!,
    userVerified: false,
    counter: -1,
  };

  await server.verifyAuthentication(authentication, credentialKey, expected);
  return new Response(get_jwt(user));
}

export default async (req: Request, context: Context) => {
  let user = new URL(req.url).searchParams.get("user");
  if (!user) {
    console.log("empty name");
    return notFound();
  }

  try {
    if (req.method == "GET") {
      return await start(user, req, context);
    } else if (req.method == "POST") {
      return await verify(user, req, context);
    } else {
      return notFound();
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
};
