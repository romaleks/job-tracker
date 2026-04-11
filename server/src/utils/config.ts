require('dotenv').config()

const requireEnv = (
  name: 'PORT' | 'MONGODB_URI' | 'TEST_MONGODB_URI' | 'JWT_SECRET',
): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const PORT = requireEnv('PORT')
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? requireEnv('TEST_MONGODB_URI')
    : requireEnv('MONGODB_URI')
const JWT_SECRET = requireEnv('JWT_SECRET')

export default { PORT, MONGODB_URI, JWT_SECRET }
