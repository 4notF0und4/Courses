export const BASE_API_URL = 'https://stapiadmn.mathyoucan.com';
export const getBearerToken = (): string | null => {
  return localStorage.getItem('token');
};
