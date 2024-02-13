export const API_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://test-api-url'
    : '/api/v1'