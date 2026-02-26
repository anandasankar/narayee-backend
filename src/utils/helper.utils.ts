/**
 * Pagination Method
 */
export const paginationMethod = (pageNo: number, limit: number): { skip: number; take: number } => {
  const skip = (pageNo - 1) * limit;

  return {
    skip: skip || 0,
    take: limit || 10,
  };
};

/**
 * Parse Cookies
 */
export const parseCookies = (cookies: string): string => {
  let cookieArray = cookies.split(';');

  const accessTokenCookie = cookieArray.find((cookie) => cookie.startsWith('access_token='));

  cookieArray = accessTokenCookie?.split('=') || [];

  return cookieArray[1];
};

/**
 * Random File Name Generator
 */
export const fileRandomName = (length: number, extension = ''): string => {
  const timestamp = Date.now();

  const randomString = Math.random()
    .toString(36)
    .substring(2, 2 + length);

  return `${timestamp}${randomString}${extension ? '.' + extension : ''}`;
};
