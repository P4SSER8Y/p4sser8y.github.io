import { Handler } from '@netlify/functions'
import { sql } from '@vercel/postgres'
import B2 from 'backblaze-b2'
import jwt from 'jsonwebtoken'

const secret = Buffer.from(process.env.JWT_PUBLIC_KEY ?? '', 'base64').toString();

async function b2_auth_and_get_url(b2: B2) {
  await b2.authorize();
  return await b2.getUploadUrl({
    bucketId: process.env.B2_BUCKET!,
  });
}

export const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod != 'POST')
      throw Error('wrong http method');
    jwt.verify(event.body ?? '', secret, {
      complete: true,
      algorithms: ['ES256']
    });
  }
  catch (err) {
    console.log(err);
    return {
      statusCode: 404,
    }
  }
  try {
    const b2 = new B2({
      applicationKeyId: process.env.B2_ID!,
      applicationKey: process.env.B2_KEY!,
    });
    let task: Promise<any>[] = [];
    task.push(b2_auth_and_get_url(b2));
    task.push(sql`SELECT jsonb_agg(data) FROM stream`);
    let result = await Promise.all(task);
    let ret = result[1].rows[0]?.jsonb_agg;
    let buffer = Buffer.from(JSON.stringify(ret), 'utf-8');
    await b2.uploadFile({
      uploadUrl: result[0].data.uploadUrl,
      uploadAuthToken: result[0].data.authorizationToken,
      fileName: 'stream/records.json',
      data: buffer,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'done' }),
    }
  }
  catch (err) {
    return {
      statusCode: 503,
      body: err,
    }
  }
}
