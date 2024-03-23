import { authOptions } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

export default NextAuth(authOptions)

// export default async function auth(req: NextApiRequest, res: NextApiResponse) {
//   res.setHeader('Cache-Control', 'no-store, max-age=0')
//   return NextAuth(req, res, authOptions)
// }
