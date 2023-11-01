import { Handler } from "@netlify/functions";
import { sql } from "@vercel/postgres";

export const handler: Handler = async (event, context) => {
  const query = await sql`SELECT jsonb_agg(data) FROM stream`;
  let ret = query.rows[0]?.jsonb_agg;

  return {
    statusCode: 200,
    body: JSON.stringify(ret),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };
};
