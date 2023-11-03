import { Context } from "@netlify/functions";
import { utils, server } from "@passwordless-id/webauthn";
import { kv } from "@vercel/kv";
import { sql } from "@vercel/postgres";

function notFound() {
  return new Response(null, { status: 404 });
}

async function start(user: string, req: Request, context: Context) {
  console.log(`start for ${user}`);
  let valid = await sql`SELECT * FROM owners WHERE name = ${user} LIMIT 1`;
  if (valid.rowCount == 0) {
    console.log(`invalid user=${user}`);
    return notFound();
  }
  let challenge = utils.randomChallenge();
  let key = `gate/challenge/${user}`;
  console.log(`remember ${challenge}`);
  await kv.set(key, challenge);
  await kv.expire(key, 60);
  return new Response(challenge);
}

async function verify(user: string, req: Request, context: Context) {
  let expect = {
    challenge: (await kv.get(`gate/challenge/${user}`)) as string,
    origin: context.site.url!,
  };
  await kv.del(`gate/challenge/${user}`);
  let registration = await req.json();
  let verify = await server.verifyRegistration(registration, expect);
  await sql`INSERT INTO gate(name, id, publickey, algorithm, origin, enabled) VALUES(${registration.username}, ${verify.credential.id}, ${verify.credential.publicKey}, ${verify.credential.algorithm}, ${context.site.url}, TRUE)`;
  return new Response(verify.credential.id);
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
