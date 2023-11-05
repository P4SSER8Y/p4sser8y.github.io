import { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";

function atHome() {
  return new Response();
}

function outdoors() {
  return new Response(null, { status: 404 });
}

function verify(token: string) {
  let payload = jwt.verify(token, process.env.JWT_PUBLIC_KEY!);
  return payload;
}

export default async (req: Request, context: Context) => {
  try {
    if (req.method == "POST") {
      let data = await req.blob();
      let token = await data.text();
      verify(token);
      return atHome();
    } else if (req.method == "GET") {
      let params = new URL(req.url).searchParams;
      let token = params.get("token") ?? "";
      verify(token);
      return atHome();
    }
    return outdoors();
  } catch (error) {
    console.log(error);
    return outdoors();
  }
};
