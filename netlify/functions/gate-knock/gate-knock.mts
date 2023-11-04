import { Context } from "@netlify/functions";
import { kv } from "@vercel/kv";
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import crypto from "crypto";

const expiredTime = parseInt(process.env.JWT_EXPIRED_TIME ?? "0");

function notFound() {
  return new Response(null, { status: 404 });
}

function get_jwt(user: string) {
  let token = jwt.sign(
    { user: user, nonce: crypto.randomUUID() },
    process.env.JWT_PRIVATE_KEY!,
    { expiresIn: expiredTime }
  );
  return token;
}

async function start(user: string, req: Request, context: Context) {
  let res = await sql`SELECT json_agg(id) 
                        FROM gate 
                        WHERE username = ${user} AND enabled = TRUE`;
  let id: string[] = res.rows[0].json_agg;
  if ((id?.length ?? 0) == 0) {
    console.log(`invalid user=${user}`);
    return notFound();
  }

  const rpID = new URL(req.url).hostname;
  const options = await generateAuthenticationOptions({
    rpID: rpID,
    allowCredentials: id.map((x) => ({
      id: Buffer.from(x, "base64url"),
      type: "public-key",
    })),
    userVerification: "discouraged",
  });

  let challenge = options.challenge;
  let key = `gate/challenge/${user}`;
  await kv.set(key, challenge);
  await kv.expire(key, 60);
  return new Response(JSON.stringify(options));
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
    await sql`SELECT * FROM gate WHERE id = ${authentication.id} LIMIT 1`;
  if (query.rowCount == 0) {
    console.log("credential ID not found");
    return notFound();
  }
  if (user != query.rows[0].username) {
    console.log("name not matched");
    return notFound();
  }

  let verification = await verifyAuthenticationResponse({
    response: authentication,
    expectedChallenge: challenge,
    expectedOrigin: context.site.url!,
    expectedRPID: new URL(req.url).hostname,
    authenticator: {
      credentialID: Buffer.from(query.rows[0].id, "base64url"),
      credentialPublicKey: Buffer.from(query.rows[0].publickey, "base64url"),
      counter: -1,
    },
    requireUserVerification: false,
  });

  return new Response(
    JSON.stringify({
      user: user,
      token: get_jwt(user),
    })
  );
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
