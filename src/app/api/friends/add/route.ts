import { fetchRedis } from '@/helpers/redis'
import { addFriendValidator } from '@/lib/add-friend'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email: emailToAdd } = addFriendValidator.parse(body.email)

    const idToAdd = (await fetchRedis(
      'get',
      `user:email:${emailToAdd}`
    )) as string
    if (!idToAdd) {
      return new Response('This preson does not exist.', { status: 400 })
    }
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (idToAdd === session.user.id) {
      return new Response("Don't act smart, when you are not!", { status: 400 })
    }

    //if user already added
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `$user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1

    if (isAlreadyAdded)
      return new Response('Already added this user', { status: 400 })

    //if user already friends
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `$user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1

    if (isAlreadyFriends)
      return new Response('Already Friends', { status: 400 })

    //vaild request
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new Response('OK', { status: 200 })
  } catch (errer) {
    if (errer instanceof z.ZodError)
      return new Response('Invalid request payload', { status: 422 })
    return new Response('Invalid request', { status: 400 })
  }
}
