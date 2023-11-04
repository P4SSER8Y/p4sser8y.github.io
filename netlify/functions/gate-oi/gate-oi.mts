import { Context } from "@netlify/functions";
import { kv } from "@vercel/kv";
import { sql } from "@vercel/postgres";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

const rpName = process.env.GATE_RP_NAME!;

function notFound() {
  return new Response(null, { status: 404 });
}

async function start(user: string, req: Request, context: Context) {
  let valid = await kv.get(`gate/waiting/${user}`);
  if (!valid) {
    console.log(`invalid user=${user}`);
    return notFound();
  }
  const options = await generateRegistrationOptions({
    rpName: rpName,
    rpID: new URL(context.site.url!).hostname,
    userID: user,
    userName: user,
    authenticatorSelection: {
      userVerification: "discouraged",
    },
  });

  let challenge = options.challenge;
  let key = `gate/challenge/${user}`;
  console.log(`remember ${challenge}`);
  await kv.set(key, challenge);
  await kv.expire(key, 60);
  return new Response(JSON.stringify(options));
}

async function verify(user: string, req: Request, context: Context) {
  let challenge = (await kv.get(`gate/challenge/${user}`)) as string;
  await kv.del(`gate/challenge/${user}`);
  
  let response = await req.json();
  console.log(challenge);

  let verification = await verifyRegistrationResponse({
    response: response,
    expectedChallenge: challenge,
    expectedOrigin: context.site.url!,
    expectedRPID: new URL(context.site.url!).hostname,
    requireUserVerification: false,
  });
  if (!verification.verified) {
    return notFound();
  }
  
  let credentialID = Buffer.from(verification.registrationInfo?.credentialID!).toString('base64url');
  let publickey = Buffer.from(verification.registrationInfo?.credentialPublicKey!).toString('base64url');

  await sql`INSERT INTO gate(username, id, publickey, origin, enabled)
            VALUES(${user},
                   ${credentialID},
                   ${publickey},
                   ${context.site.url},
                   TRUE)`;
  return new Response(JSON.stringify(verification.registrationInfo));
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
