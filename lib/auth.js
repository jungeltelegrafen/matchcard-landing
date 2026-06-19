import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export const auth = betterAuth({
  baseURL:    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret:     process.env.BETTER_AUTH_SECRET,
  database:   pool,

  socialProviders: {
    microsoft: {
      clientId:     process.env.AZURE_CLIENT_ID     || '',
      clientSecret: process.env.AZURE_CLIENT_SECRET || '',
      tenantId:     process.env.AZURE_TENANT_ID     || 'common',
    },
  },

  // Block sign-up from non-approved domains
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowed = (process.env.ALLOWED_DOMAINS || '')
            .split(',').map(d => d.trim().toLowerCase()).filter(Boolean)

          if (allowed.length > 0) {
            const domain = user.email?.split('@')[1]?.toLowerCase()
            if (!allowed.includes(domain)) {
              throw new Error(`Access denied: ${domain} is not an authorised domain`)
            }
          }

          return { data: user }
        },
      },
    },
  },
})
