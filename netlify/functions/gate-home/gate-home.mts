import { Context } from "@netlify/functions";
import { kv } from "@vercel/kv";

function atHome(ttl: number) {
  return new Response(`${ttl}`);
}

function outdoors() {
  return new Response(null, { status: 404 });
}

export default async (req: Request, context: Context) => {
  try {
    if (req.method == "POST") {
      let data = await req.json();
      let key = `gate/home/${data.user}/${data.token}`;
      let ttl = await kv.ttl(key);
      if (ttl >= -1) {
        return atHome(ttl);
      }
    } else if (req.method == "GET") {
      let params = new URL(req.url).searchParams;
      console.log(params)
      let user = params.get("user");
      let token = params.get("token");
      if (user && token) {
        let key = `gate/home/${user}/${token}`;
        let ttl = await kv.ttl(key);
        if (ttl >= -1) {
          return atHome(ttl);
        }
      }
    }
    return outdoors();
  } catch (error) {
    console.log(error);
    return outdoors();
  }
};
