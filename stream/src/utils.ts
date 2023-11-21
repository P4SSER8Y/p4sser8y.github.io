export function convertAssetsToFullPath(uri: string | null): string | null {
  if (!uri || uri.length == 0) return null;
  if (uri.match(/^\w+:\/\//)) return uri;
  return `${process.env.STREAM_MEDIA_BASE}/${uri}`;
}
