export const handler = async (event) => {
  return {
    statusCode: 303,
    headers: { Location: '/dashboard/', 'Cache-Control': 'no-store' },
    body: ''
  }
}