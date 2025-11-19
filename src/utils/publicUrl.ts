export const getPublicUrl = (path: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  const repoName = "manjaro-kde-web";
  const prefix = isProd ? `/${repoName}` : "";
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${cleanPath}`;
};
